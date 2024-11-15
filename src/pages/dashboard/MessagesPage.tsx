// src/pages/dashboard/MessagesPage.tsx

import { useEffect, useState } from "react";
import { getMessages } from "../../services/messageService";
import { Message } from "../../types";

const MessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages();
        setMessages(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch messages.");
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Messages</h1>
      <ul className="space-y-4">
        {messages.map((message) => (
          <li key={message.id} className="bg-white p-4 shadow rounded">
            <h3 className="font-bold">{message.sender}</h3>
            <p>{message.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessagesPage;
