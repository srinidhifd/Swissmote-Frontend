import React, { useState } from "react";
import axios from "axios";

const ReplyViaBotPage: React.FC = () => {
  const [listing, setListing] = useState("");
  const [chatId, setChatId] = useState("");
  const [botMessage, setBotMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSendBotReply = async () => {
    setSuccessMessage(null);
    setError(null);

    if (!listing.trim() || !chatId.trim() || !botMessage.trim()) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        `https://api.trollgold.org/persistventures/assignment/replyCandidateBot?listing=${listing}`,
        {
          chat_id: Number(chatId),
          message: botMessage,
        }
      );

      if (response.data.success) {
        setSuccessMessage("Message was sent successfully!");
        setListing("");
        setChatId("");
        setBotMessage("");
      } else {
        setError("Failed to send the bot reply. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while sending the bot reply.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Bot Reply</h1>
        <p className="text-gray-600 mb-6">
          This system uses automated responses. Please ensure all information is accurate before sending.
        </p>

        <div className="space-y-6">
          {/* Listing Number Input */}
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="flex-1 mb-6 md:mb-0">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Listing Number <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={listing}
                onChange={(e) => setListing(e.target.value)}
                placeholder="Enter listing number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Chat ID Input */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chat ID <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="Enter chat ID"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Bot Message Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bot Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={botMessage}
              onChange={(e) => setBotMessage(e.target.value)}
              placeholder="Enter the bot reply message..."
              rows={6}
              maxLength={1000}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <div className="text-gray-500 text-sm mt-1 text-right">
              {botMessage.length} / 1000
            </div>
          </div>

          {/* Send Bot Reply Button */}
          <button
            onClick={handleSendBotReply}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send Bot Reply
          </button>

          {/* Success and Error Messages */}
          {successMessage && (
            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReplyViaBotPage;
