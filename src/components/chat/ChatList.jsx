import { useState, useEffect } from "react";
import axios from "axios";

const ChatList = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      const res = await axios.get("http://localhost:5000/api/chat/my-chats", { withCredentials: true });
      setChats(res.data);
    };
    fetchChats();
  }, []);

  return (
    <div>
      <h3>Söhbətlər</h3>
      <ul>
        {chats.map((chat) => (
          <li key={chat._id} onClick={() => onSelectChat(chat)}>
            {chat.users.map((u) => u.username).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
