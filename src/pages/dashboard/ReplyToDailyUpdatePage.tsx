import React, { useState } from "react";
import axios from "axios";

const ReplyToDailyUpdatePage: React.FC = () => {
  const [listing, setListing] = useState<string>("");
  const [chatId, setChatId] = useState<string>("");
  const [replyMessage, setReplyMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!listing || !chatId || !replyMessage.trim()) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        `https://api.trollgold.org/persistventures/assignment/reply_daily?listing=${listing}`,
        {
          chat_id: parseInt(chatId),
          message: replyMessage,
        }
      );

      if (response.data.success) {
        setSuccessMessage("Message sent successfully");
        setReplyMessage("");
      } else {
        throw new Error("Failed to send the reply.");
      }
    } catch (err) {
      setError("Error submitting reply.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Reply to Daily Update</h1>
        <p className="text-gray-600 mb-6">
          Send a reply to a specific daily update. Make sure to verify the listing number and chat ID before sending.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Reply Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="listing" className="block text-sm font-medium text-gray-700">
                Listing Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="listing"
                value={listing}
                onChange={(e) => setListing(e.target.value)}
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter listing number"
              />
            </div>

            <div>
              <label htmlFor="chatId" className="block text-sm font-medium text-gray-700">
                Chat ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="chatId"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter chat ID"
              />
            </div>
          </div>

          <div>
            <label htmlFor="replyMessage" className="block text-sm font-medium text-gray-700">
              Reply Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="replyMessage"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Enter your reply message"
              rows={5}
              maxLength={1000}
              className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <div className="text-gray-500 text-sm mt-1 text-right">
              {replyMessage.length} / 1000
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Send Reply
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReplyToDailyUpdatePage;
