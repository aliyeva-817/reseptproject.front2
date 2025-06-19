import { useState, useEffect, useRef } from "react";
import socket from "../../services/socket";
import axios from "axios";

const ChatRoom = ({ chatId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;

    socket.emit("joinChat", chatId);

    const fetchMessages = async () => {
      const res = await axios.get(`http://localhost:5000/api/chat/messages/${chatId}`, { withCredentials: true });
      setMessages(res.data);
    };
    fetchMessages();

    socket.on("newMessage", (message) => {
      if (message.chatId === chatId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("updatedMessage", (message) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === message._id ? message : m))
      );
    });

    socket.on("deletedMessage", (messageId) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    });

    return () => {
      socket.off("newMessage");
      socket.off("updatedMessage");
      socket.off("deletedMessage");
    };
  }, [chatId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("sendMessage", {
      chatId,
      sender: currentUser._id,
      content: input.trim(),
    });
    setInput("");
  };

  const editMessage = (messageId, newContent) => {
    socket.emit("editMessage", { messageId, newContent });
  };

  const deleteMessage = (messageId) => {
    socket.emit("deleteMessage", { messageId });
  };

  return (
    <div>
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {messages.map((m) => (
          <div key={m._id}>
            <b>{m.sender.username}</b>:&nbsp;
            <span>
              {m.content}
              {m.edited && " (redaktə edildi)"}
            </span>
            {m.sender._id === currentUser._id && (
              <>
                <button onClick={() => editMessage(m._id, prompt("Yeni mətn:", m.content) || m.content)}>Düzəliş</button>
                <button onClick={() => deleteMessage(m._id)}>Sil</button>
              </>
            )}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <input
        type="text"
        placeholder="Mesaj yazın..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Göndər</button>
    </div>
  );
};

export default ChatRoom;
