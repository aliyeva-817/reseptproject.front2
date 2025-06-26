import { useState, useEffect, useRef } from "react";
import socket from "../../services/socket";
import axios from "axios";

const ChatRoom = ({ selectedUser, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/messages/conversation/${currentUser._id}/${selectedUser._id}`,
          { withCredentials: true }
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Mesajlar alınmadı", err);
      }
    };

    fetchMessages();

    socket.emit("addUser", currentUser._id);

    const handleGetMessage = (message) => {
      // HƏR İKİ TƏRƏF ÜÇÜN GÖSTƏR
      if (
        (message.senderId === selectedUser._id && message.receiverId === currentUser._id) ||
        (message.senderId === currentUser._id && message.receiverId === selectedUser._id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleMessageEdited = (data) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === data._id ? { ...m, content: data.text, edited: true } : m
        )
      );
    };

    const handleMessageDeleted = ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    };

    socket.on("getMessage", handleGetMessage);
    socket.on("messageEdited", handleMessageEdited);
    socket.on("messageDeleted", handleMessageDeleted);

    return () => {
      socket.off("getMessage", handleGetMessage);
      socket.off("messageEdited", handleMessageEdited);
      socket.off("messageDeleted", handleMessageDeleted);
    };
  }, [selectedUser, currentUser]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      content: input.trim(),
    };

    try {
      const res = await axios.post("http://localhost:5000/api/messages", newMessage, {
        withCredentials: true,
      });

      socket.emit("sendMessage", {
        _id: res.data._id,
        senderId: res.data.sender,
        receiverId: res.data.receiver,
        text: res.data.content,
        createdAt: res.data.createdAt,
        edited: false,
      });

      // Artıq emit edən də görür
      setMessages((prev) => [...prev, res.data]);
      setInput("");
    } catch (err) {
      console.error("Mesaj göndərilə bilmədi", err);
    }
  };

  const editMessage = async (messageId, content) => {
    const newContent = prompt("Yeni mesaj:", content);
    if (newContent && newContent !== content) {
      try {
        await axios.put(
          `http://localhost:5000/api/messages/${messageId}`,
          { newText: newContent },
          { withCredentials: true }
        );

        socket.emit("editMessage", {
          _id: messageId,
          text: newContent,
          receiverId: selectedUser._id,
        });
      } catch (err) {
        console.error("Redaktə zamanı xəta", err);
      }
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await axios.delete(`http://localhost:5000/api/messages/${messageId}`, {
        withCredentials: true,
      });

      socket.emit("deleteMessage", {
        messageId,
        receiverId: selectedUser._id,
      });

      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    } catch (err) {
      console.error("Silinmə zamanı xəta", err);
    }
  };

  return (
    <div style={{ padding: "1rem", borderLeft: "1px solid #ccc" }}>
      <h3>{selectedUser?.username} ilə söhbət</h3>
      <div style={{ maxHeight: "400px", overflowY: "auto", marginBottom: "1rem" }}>
        {messages.map((m) => (
          <div key={m._id}>
            <b>{m.sender === currentUser._id || m.senderId === currentUser._id ? "Siz" : selectedUser.username}</b>:&nbsp;
            <span>
              {m.text || m.content} {m.edited && <i>(düzənləndi)</i>}
            </span>
            {(m.sender === currentUser._id || m.senderId === currentUser._id) && (
              <>
                <button onClick={() => editMessage(m._id, m.text || m.content)}>✏️</button>
                <button onClick={() => deleteMessage(m._id)}>🗑️</button>
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
