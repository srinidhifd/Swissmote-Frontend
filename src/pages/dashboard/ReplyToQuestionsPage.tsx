import React, { useState } from "react";
import axios from "axios";

const ReplyToQuestionsPage: React.FC = () => {
  const [listing, setListing] = useState<string>("");
  const [chatId, setChatId] = useState<string>("");
  const [replyMessage, setReplyMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!listing.trim() || !chatId.trim() || !replyMessage.trim()) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        `https://api.trollgold.org/persistventures/assignment/reply_question?listing=${listing}`,
        {
          chat_id: Number(chatId),
          message: replyMessage,
        }
      );

      if (response.data.success) {
        setSuccessMessage("Message sent successfully!");
        setListing("");
        setChatId("");
        setReplyMessage("");
      } else {
        setError("Failed to send the reply. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while sending the reply. Please try again.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Reply to Question</h1>
        <p className="text-gray-600 mb-6">
          Send a reply to a specific question. Make sure to verify the listing number and chat ID before sending.
        </p>

        <form onSubmit={handleReplySubmit} className="space-y-6">
          {/* Listing Number Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Listing Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={listing}
              onChange={(e) => setListing(e.target.value)}
              placeholder="Enter listing number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Chat ID Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chat ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="Enter chat ID"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Reply Message Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reply Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Enter your reply message"
              rows={6}
              maxLength={1000}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <div className="text-gray-500 text-sm mt-1 text-right">
              {replyMessage.length} / 1000
            </div>
          </div>

          {/* Send Reply Button */}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Send Reply
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
        </form>
      </div>
    </div>
  );
};

export default ReplyToQuestionsPage;
