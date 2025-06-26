import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ChatList.module.css";
import { FaTrashAlt } from "react-icons/fa";

const ChatList = ({ onSelectChat, currentUserId, onlineUsers, socket }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetchChats();

    if (socket) {
      socket.on("getMessage", () => {
        fetchChats(); // mesaj gələndə siyahını yenilə
      });

      socket.on("onlineUsers", () => {
        fetchChats(); // online status dəyişəndə də yenilə
      });
    }

    return () => {
      if (socket) {
        socket.off("getMessage");
        socket.off("onlineUsers");
      }
    };
  }, [socket, onlineUsers, currentUserId]);

  const fetchChats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/chat/my-chats", {
        withCredentials: true,
      });
      setChats(res.data);
    } catch (err) {
      console.error("Chat list error:", err);
    }
  };

  const handleDelete = async (userId) => {
    const confirm = window.confirm("Söhbəti silmək istədiyinizə əminsiniz?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/chat/clear/${userId}`, {
        withCredentials: true,
      });
      setChats((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("Silinmə xətası:", err);
    }
  };

  const isOnline = (userId) => onlineUsers.includes(userId);

  return (
    <div className={styles.chatList}>
      <h3 className={styles.title}>Söhbətlər</h3>
      <ul className={styles.list}>
        {chats.map((user) => (
          <li key={user._id} className={styles.item}>
            <div className={styles.userBox} onClick={() => onSelectChat(user)}>
              <span
                className={`${styles.statusDot} ${
                  isOnline(user._id) ? styles.online : styles.offline
                }`}
              ></span>
              <span className={styles.username}>{user.username}</span>
            </div>
            <button
              className={styles.deleteBtn}
              onClick={() => handleDelete(user._id)}
            >
              <FaTrashAlt />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
