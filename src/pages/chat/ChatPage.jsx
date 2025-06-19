import { useState, useEffect, useRef, useContext } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { io } from 'socket.io-client';
import { ThemeContext } from '../../components/theme/ThemeContext';
import styles from './ChatPage.module.css';
import { FaEdit, FaTrashAlt, FaArrowLeft } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SOCKET_SERVER_URL = 'http://localhost:5000';

const ChatPage = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [username, setUsername] = useState('');
  const [recipient, setRecipient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [editId, setEditId] = useState(null);
  const socketRef = useRef();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);
    if (userId) socketRef.current.emit("addUser", userId);

    socketRef.current.on("getMessage", (data) => {
      if (recipient && data.senderId === recipient._id) {
        setMessages(prev => [...prev, {
          _id: data._id,
          text: data.text,
          fromSelf: false,
          timestamp: new Date(data.createdAt),
          edited: data.edited || false,
        }]);
      }
    });

    socketRef.current.on("messageEdited", (data) => {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === data._id
            ? { ...msg, text: data.text, edited: true }
            : msg
        )
      );
    });

    socketRef.current.on("messageDeleted", ({ messageId }) => {
      setMessages(prev => prev.filter(msg => msg._id !== messageId));
    });

    return () => socketRef.current.disconnect();
  }, [recipient?._id, userId]);

  const handleFindUser = async () => {
    if (!username.trim()) return toast.error("İstifadəçi adı daxil edin");
    try {
      const res = await axiosInstance.get(`/users/search?q=${username}`);
      if (res.data.length === 0) {
        toast.error('İstifadəçi tapılmadı');
        setRecipient(null);
        setMessages([]);
        return;
      }
      setRecipient(res.data[0]);
      setUsername('');
      fetchMessages(res.data[0]._id);
      toast.success(`İstifadəçi tapıldı: ${res.data[0].username}`);
    } catch {
      toast.error('Xəta baş verdi');
      setRecipient(null);
      setMessages([]);
    }
  };

  const fetchMessages = async (recipientId) => {
    try {
      const res = await axiosInstance.get(`/messages/conversation/${userId}/${recipientId}`);
      const loaded = res.data.map(msg => ({
        _id: msg._id,
        text: msg.content,
        fromSelf: msg.sender === userId,
        timestamp: new Date(msg.createdAt),
        edited: msg.edited,
      }));
      setMessages(loaded);
    } catch {
      toast.error("Mesajlar yüklənmədi");
    }
  };

  const handleSendMessage = async () => {
    if (!recipient || !messageText.trim()) return;

    if (editId) {
      try {
        await axiosInstance.put(`/messages/${editId}`, { newText: messageText });
        setMessages(prev =>
          prev.map(m =>
            m._id === editId ? { ...m, text: messageText, edited: true } : m
          )
        );
        socketRef.current.emit('editMessage', {
          _id: editId,
          text: messageText,
          receiverId: recipient._id,
        });
        setEditId(null);
        setMessageText('');
      } catch {
        toast.error("Yenilənmə xətası");
      }
      return;
    }

    try {
      const res = await axiosInstance.post('/messages', {
        senderId: userId,
        receiverId: recipient._id,
        content: messageText,
      });

      const msgData = {
        _id: res.data._id,
        senderId: userId, // BUNU ƏLAVƏ EDİRİK!
        receiverId: recipient._id,
        text: res.data.content,
        createdAt: res.data.createdAt,
        edited: res.data.edited || false,
      };

      socketRef.current.emit('sendMessage', msgData);

      setMessages(prev => [...prev, {
        _id: res.data._id,
        text: res.data.content,
        fromSelf: true,
        timestamp: new Date(res.data.createdAt),
        edited: false,
      }]);
      setMessageText('');
    } catch {
      toast.error("Mesaj göndərilə bilmədi");
    }
  };

  const handleEdit = (id, text) => {
    setEditId(id);
    setMessageText(text);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Mesaj silinsinmi?");
    if (!confirm) return;

    try {
      await axiosInstance.delete(`/messages/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
      socketRef.current.emit('deleteMessage', {
        messageId: id,
        receiverId: recipient._id,
      });
    } catch {
      toast.error("Silinmə xətası");
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const themeClass = styles[`theme_${theme}`];

  return (
    <div className={`${styles.chatPage} ${themeClass}`}>
      <ToastContainer />
      <div className={styles.sidebar}>
        <div className={styles.topBar}>
          <input
            placeholder="İstifadəçi axtar..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleFindUser}>🔍</button>
        </div>
        <select onChange={handleThemeChange} value={theme}>
          <option value="brokoli">🥦 Brokoli</option>
          <option value="carrot">🥕 Kök</option>
          <option value="watermelon">🍉 Qarpız</option>
          <option value="dark">🌑 Qaranlıq</option>
        </select>
        <button onClick={handleClearChat}>Söhbəti təmizlə</button>
      </div>

      <div className={styles.chatArea}>
        <div className={styles.header}>
          {recipient && (
            <h3 onClick={() => {
              setRecipient(null);
              setUsername('');
            }} style={{ cursor: 'pointer' }}>
              <FaArrowLeft /> {recipient.username}
            </h3>
          )}
        </div>

        <div className={styles.messageList}>
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`${styles.message} ${msg.fromSelf ? styles.fromSelf : styles.fromOther}`}
            >
              <p>
                🍇 {msg.text}
                {msg.edited && <span className={styles.editedTag}>(düzənləndi)</span>}
                {msg.fromSelf && (
                  <>
                    <FaEdit onClick={() => handleEdit(msg._id, msg.text)} className={styles.icon} />
                    <FaTrashAlt onClick={() => handleDelete(msg._id)} className={styles.icon} />
                  </>
                )}
              </p>
              <small>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
            </div>
          ))}
        </div>

        <div className={styles.inputArea}>
          <textarea
            placeholder="Mesaj yazın..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <button onClick={handleSendMessage}>
            {editId ? "Yenilə" : "Göndər"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
