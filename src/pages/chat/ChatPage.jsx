import { useState, useEffect, useRef, useContext } from 'react';
import axios from '../../services/axiosInstance';
import { io } from 'socket.io-client';
import { ThemeContext } from '../../components/theme/ThemeContext';
import styles from './ChatPage.module.css';
import { FaEdit, FaTrashAlt, FaArrowLeft, FaSearch } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SOCKET_SERVER_URL = 'http://localhost:5000';
const emojiOptions = ['🍎','🍏','🍐','🍒','🍓','🥭','🥝','🍆'];

const ChatPage = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [username, setUsername] = useState('');
  const [recipient, setRecipient] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [editId, setEditId] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const socket = useRef(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    socket.current = io(SOCKET_SERVER_URL);
    socket.current.emit('addUser', userId);

    socket.current.on('onlineUsers', (users) => setOnlineUsers(users));

    socket.current.on('getMessage', (msg) => {
      const isCurrentChat = recipient && msg.senderId === recipient._id;

      const newMsg = {
        _id: msg._id,
        text: msg.text,
        fromSelf: false,
        timestamp: new Date(msg.createdAt),
        edited: msg.edited || false,
        emoji: msg.emoji || emojiOptions[Math.floor(Math.random() * emojiOptions.length)]
      };

      setMessages((prev) => {
        const exists = prev.some((m) => m._id === msg._id);
        if (exists || !isCurrentChat) return prev;
        return [...prev, newMsg];
      });

      // 👇 BU HİSSƏ SİLİNDİ (çünki bildirişdə var idi)
      // if (!isCurrentChat) {
      //   setUnreadCounts(prev => ({
      //     ...prev,
      //     [msg.senderId]: (prev[msg.senderId] || 0) + 1
      //   }));
      // }
    });

    socket.current.on('messageEdited', ({ _id, text }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === _id ? { ...msg, text: text || msg.text, edited: true } : msg
        )
      );
    });

    socket.current.on('unreadMessages', (msgs) => {
      const newMsgs = msgs.map((msg) => ({
        _id: msg._id,
        text: msg.content,
        fromSelf: false,
        timestamp: new Date(msg.createdAt),
        edited: msg.edited || false,
        emoji: emojiOptions[Math.floor(Math.random() * emojiOptions.length)]
      }));

      setMessages((prev) => [...prev, ...newMsgs]);
    });

    socket.current.on('messageDeleted', ({ messageId }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    });

    return () => socket.current.disconnect();
  }, [recipient]);

  useEffect(() => {
    loadChatUsers();
    const saved = localStorage.getItem('chatRecipient');
    if (saved) {
      const u = JSON.parse(saved);
      setRecipient(u);
      loadMessages(u._id);
    }
  }, []);

  useEffect(() => {
    const handleNotification = ({ from, text }) => {
      if (!recipient || recipient._id !== from) {
        toast.info(`📩 ${text}`);
        setUnreadCounts(prev => ({
          ...prev,
          [from]: (prev[from] || 0) + 1
        }));
      }
    };

    if (socket.current) {
      socket.current.on('newNotification', handleNotification);
    }

    return () => {
      if (socket.current) {
        socket.current.off('newNotification', handleNotification);
      }
    };
  }, [recipient]);

  const loadChatUsers = async () => {
    try {
      const res = await axios.get('/chat/my-chats');
      setChatUsers(res.data);
    } catch {
      toast.error('Chat siyahısı alınmadı');
    }
  };

  const loadMessages = async (rid) => {
    try {
      const res = await axios.get(`/messages/conversation/${userId}/${rid}`);
      setMessages(res.data.map((msg) => ({
        _id: msg._id,
        text: msg.content,
        fromSelf: msg.sender === userId,
        timestamp: new Date(msg.createdAt),
        edited: msg.edited,
        emoji: emojiOptions[Math.floor(Math.random() * emojiOptions.length)]
      })));
      socket.current.emit('joinChat', {
        userId,
        partnerId: rid
      });
    } catch {
      toast.error('Mesajlar yüklənmədi');
    }
  };

  const handleFindUser = async () => {
    if (!username.trim()) return toast.error('Ad daxil edin');

    try {
      const res = await axios.get(`/users/search?q=${username}`);
      if (!res.data.length) return toast.error('İstifadəçi tapılmadı');

      const exactMatch = res.data.find(user => user.username.toLowerCase() === username.toLowerCase());
      if (!exactMatch) return toast.error('Tam uyğun istifadəçi tapılmadı');

      setRecipient(exactMatch);
      localStorage.setItem('chatRecipient', JSON.stringify(exactMatch));
      loadMessages(exactMatch._id);
      setUnreadCounts(prev => {
        const updated = { ...prev };
        delete updated[exactMatch._id];
        return updated;
      });
      setUsername('');
    } catch {
      toast.error('Xəta baş verdi');
    }
  };

  const handleSend = async () => {
    if (!recipient || !messageText.trim()) return;

    if (editId) {
      try {
        await axios.put(`/messages/${editId}`, { newText: messageText });
        socket.current.emit('editMessage', {
          messageId: editId,
          newText: messageText,
          receiverId: recipient._id
        });
        setMessages((prev) => prev.map((m) => (m._id === editId ? { ...m, text: messageText, edited: true } : m)));
        setEditId(null);
        setMessageText('');
      } catch {
        toast.error('Yenilənmə xətası');
      }
      return;
    }

    try {
      const res = await axios.post('/messages', {
        senderId: userId,
        receiverId: recipient._id,
        content: messageText
      });

      const newMsg = {
        _id: res.data._id,
        text: res.data.content,
        fromSelf: true,
        timestamp: new Date(res.data.createdAt),
        edited: false,
        emoji: emojiOptions[Math.floor(Math.random() * emojiOptions.length)]
      };
      setMessages((prev) => [...prev, newMsg]);

      socket.current.emit('sendMessage', {
        _id: res.data._id,
        senderId: userId,
        receiverId: recipient._id,
        text: res.data.content,
        createdAt: res.data.createdAt,
        edited: false
      });

      setMessageText('');
    } catch {
      toast.error('Göndərilə bilmədi');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Silinsin?')) return;
    try {
      await axios.delete(`/messages/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      socket.current.emit('deleteMessage', {
        messageId: id,
        receiverId: recipient._id
      });
    } catch {
      toast.error('Silinmə xətası');
    }
  };

  const handleEdit = (id, text) => {
    setEditId(id);
    setMessageText(text);
  };

  return (
    <div className={`${styles.chatPage} ${styles[`theme_${theme}`]}`}>
      <ToastContainer />
      <aside className={styles.sidebar}>
        <label>Istifadəçi axtar:</label>
        <div className={styles.searchWrapDribbble}>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Istifadəçi..." />
          <button onClick={handleFindUser}><FaSearch /></button>
        </div>
        <label>Tema:</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="brokoli">🥦 Brokoli</option>
          <option value="carrot">🥕 Kök</option>
          <option value="watermelon">🍉 Qarpız</option>
          <option value="dark">🌑 Qaranlıq</option>
        </select>
        <ul className={styles.chatList}>
          {chatUsers.map((u) => (
            <li key={u._id} onClick={() => {
              setRecipient(u);
              localStorage.setItem('chatRecipient', JSON.stringify(u));
              loadMessages(u._id);
              setUnreadCounts(prev => {
                const updated = { ...prev };
                delete updated[u._id];
                return updated;
              });
            }}>
              <span className={`${styles.statusDot} ${onlineUsers.includes(u._id) ? styles.online : styles.offline}`} />
              {u.username}
              {unreadCounts[u._id] && (
                <span className={styles.unreadBadge}>{unreadCounts[u._id]}</span>
              )}
            </li>
          ))}
        </ul>
      </aside>

      <div className={styles.chatArea}>
        <div className={styles.header}>
          {recipient && <h3 onClick={() => {
            setRecipient(null);
            setMessages([]);
            localStorage.removeItem('chatRecipient');
          }}><FaArrowLeft /> {recipient.username}</h3>}
        </div>

        {!recipient && (
          <div className={styles.noChatSelected}>
            <p>Heç kimlə söhbət etmirsiniz</p>
          </div>
        )}

        <div className={styles.messageList}>
          {messages.map((m) => (
            <div key={m._id} className={`${styles.message} ${m.fromSelf ? styles.fromSelf : styles.fromOther}`}>
              <p>
                {m.emoji} {m.text}
                {m.edited && <span className={styles.editedTag}>(düzənləndi)</span>}
                {m.fromSelf && (
                  <>
                    <FaEdit onClick={() => handleEdit(m._id, m.text)} />
                    <FaTrashAlt onClick={() => handleDelete(m._id)} />
                  </>
                )}
              </p>
              <small>{m.timestamp.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}</small>
            </div>
          ))}
        </div>

        {recipient && (
          <div className={styles.inputArea}>
            <textarea
              placeholder="Mesaj yazın..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <button onClick={handleSend}>{editId ? 'Yenilə' : 'Göndər'}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
