import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5000";

const ChatPage = () => {
  const [username, setUsername] = useState('');
  const [recipient, setRecipient] = useState(null); // recipient user object {_id, username}
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const socketRef = useRef();
  const userId = localStorage.getItem("userId"); // Backend login zamanı userId-ni localStorage-ə əlavə et

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);

    if (userId) {
      socketRef.current.emit("addUser", userId);
    }

    socketRef.current.on('getMessage', (data) => {
      // Gələn mesaj hazırki söhbət istifadəçisinədirsə əlavə et
      if (recipient && data.senderId === recipient._id) {
        setMessages(prev => [...prev, {
          text: data.text,
          fromSelf: false,
          timestamp: new Date()
        }]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [recipient, userId]);

  const handleFindUser = async () => {
  if (!username.trim()) return alert("İstifadəçi adı daxil edin");
  try {
    const res = await axiosInstance.get(`/users/search?q=${username}`);
    if (res.data.length === 0) {
      alert('İstifadəçi tapılmadı');
      setRecipient(null);
      setMessages([]);
      return;
    }
    setRecipient(res.data[0]);
    alert(`İstifadəçi tapıldı: ${res.data[0].username}`);
    fetchMessages(res.data[0]._id);
  } catch (err) {
    alert('Xəta baş verdi: ' + err.message);
    setRecipient(null);
    setMessages([]);
  }
};


  const fetchMessages = async (recipientId) => {
    try {
      const res = await axiosInstance.get(`/messages/conversation/${userId}/${recipientId}`);
      const loadedMessages = res.data.map(m => ({
        text: m.content,
        fromSelf: m.sender === userId,
        timestamp: new Date(m.createdAt)
      }));
      setMessages(loadedMessages);
    } catch (err) {
      console.error("Mesajlar yüklənmədi:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!recipient || !messageText.trim()) return alert('İstifadəçi və mesaj daxil edin');

    const newMessage = {
      senderId: userId,
      receiverId: recipient._id,
      text: messageText,
      timestamp: new Date(),
    };

    try {
      await axiosInstance.post('/messages', {
        senderId: newMessage.senderId,
        receiverId: newMessage.receiverId,
        content: newMessage.text
      });

      socketRef.current.emit('sendMessage', newMessage);

      setMessages(prev => [...prev, { ...newMessage, fromSelf: true }]);
      setMessageText('');
    } catch (err) {
      alert("Mesaj göndərilə bilmədi: " + err.message);
    }
  };

  return (
    <div>
      <h2>Real-time Chat</h2>
      <input 
        placeholder="İstifadəçi adı daxil edin" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
      <button onClick={handleFindUser}>Tap</button>

      <div style={{border: '1px solid black', height: '300px', overflowY: 'scroll'}}>
        {messages.map((msg, i) => (
          <div key={i} style={{textAlign: msg.fromSelf ? 'right' : 'left'}}>
            <p>{msg.text}</p>
            <small>{msg.timestamp.toLocaleTimeString()}</small>
          </div>
        ))}
      </div>

      <textarea
        placeholder="Mesaj yazın"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <button onClick={handleSendMessage}>Göndər</button>
    </div>
  );
};

export default ChatPage;
