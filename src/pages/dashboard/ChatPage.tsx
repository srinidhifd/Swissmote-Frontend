import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import ChatBox from "../../components/ChatBox";
import MessageInput from "../../components/MessageInput";
import { fetchChat, fetchChatHistory, sendMessage } from "../../services/messageService";
import { TailSpin } from "react-loader-spinner";

const ChatPage: React.FC = () => {
  const location = useLocation();
  const authToken = import.meta.env.VITE_AUTH_TOKEN;
  const { listing, candidateId, userName, projectName,listingName } = location.state || {}; // Dynamic data passed via route

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [offsetCmi, setOffsetCmi] = useState<number>(0); // Offset for pagination
  const [allMessagesLoaded, setAllMessagesLoaded] = useState<boolean>(false);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const chatBoxRef = useRef<HTMLDivElement>(null);

  // Correct WebSocket URL
  const wsUrl = `wss://api.trollgold.org/chat/ws?listing=${listing}&id=${chatId}&token=${authToken}`;

  useEffect(() => {
    if (!listing || !candidateId) {
      setError("Invalid chat details.");
      setLoading(false);
      return;
    }

    const fetchChatData = async () => {
      setLoading(true);
      try {
        const data = await fetchChat(listing, candidateId);
        setMessages(Object.values(data.messages || []));
        setChatId(data.chat_id);

        // Commenting out the markMessagesAsSeen call
        // await markMessagesAsSeen(listing, data.chat_id);

        setError(null);

        // Initialize WebSocket connection
        const ws = new WebSocket(wsUrl);
        ws.onopen = () => console.log("WebSocket connection established");
        ws.onmessage = (event) => {
          const newMessage = JSON.parse(event.data);
          setMessages((prev) => [...prev, newMessage]); // Append new messages in real-time
        };
        ws.onerror = (err) => console.error("WebSocket error:", err);
        ws.onclose = () => console.log("WebSocket connection closed");

        setSocket(ws);
      } catch (error) {
        setError("Failed to fetch chat messages. Please try again.");
        console.error("Failed to fetch chat data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();

    return () => {
      socket?.close(); // Clean up WebSocket connection on unmount
    };
  }, [listing, candidateId, wsUrl]);

  const handleLoadMoreHistory = async () => {
    if (!chatId || loadingHistory || allMessagesLoaded) return;

    setLoadingHistory(true);
    try {
      const historyData = await fetchChatHistory(chatId, offsetCmi);
      const newMessages = historyData.data.chat_messages || [];

      setMessages((prev) => [...newMessages, ...prev]);
      setOffsetCmi(offsetCmi + newMessages.length);
      setAllMessagesLoaded(historyData.data.are_all_messages_loaded || false);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;

    const tempMessage = {
      id: Date.now(),
      message: newMessage || (selectedFile ? selectedFile.name : ""),
      was_me: true,
      date: new Date().toISOString(),
      time: new Date().toLocaleTimeString(),
      is_file: !!selectedFile,
    };

    setMessages((prev) => [...prev, tempMessage]); // Optimistic UI update

    try {
      if (socket && socket.readyState === WebSocket.OPEN) {
        // Send via WebSocket
        const payload = {
          message: newMessage,
          attached_file: selectedFile, // WebSocket may not handle files directly
        };
        socket.send(JSON.stringify(payload));
      } else {
        // Fallback to API
        await sendMessage(listing, chatId!, newMessage, selectedFile || undefined);
      }
      setNewMessage("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleScroll = () => {
    if (chatBoxRef.current?.scrollTop === 0) {
      handleLoadMoreHistory();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <TailSpin height="80" width="80" color="#4fa94d" ariaLabel="loading" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 h-[100vh] overflow-hidden flex justify-center items-center">
      <div className="w-full max-w-5xl h-[90%] bg-white shadow-lg rounded-lg flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-gray-50">
          <h1 className="text-xl font-bold text-gray-800">{userName}</h1>
          <p className="text-sm text-gray-600 mt-1">
            Project: <span className="text-gray-800">{projectName}</span> | Listing Name:{" "}
            <span className="text-gray-800">{listingName}</span>
          </p>
        </div>

        {/* Chat Box */}
        <div
          ref={chatBoxRef}
          className="flex-grow overflow-y-auto hide-scrollbar p-4"
          onScroll={handleScroll}
        >
          <ChatBox messages={messages} />
          {loadingHistory && (
            <div className="text-center text-gray-500 my-2">Loading more messages...</div>
          )}
        </div>

        {/* Input Section */}
        <MessageInput
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onSend={handleSendMessage}
          onFileSelect={(file) => setSelectedFile(file)}
        />
      </div>
    </div>
  );
};

export default ChatPage;
