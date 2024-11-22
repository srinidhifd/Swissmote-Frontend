import { useState } from "react";
import axios from "axios";

const SendMessagePage: React.FC = () => {
  const [messageType, setMessageType] = useState("invite_message");
  const [messageContent, setMessageContent] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async () => {
    setSuccessMessage(null);
    setError(null);

    if (!messageContent.trim()) {
      setError("Message content is required.");
      return;
    }

    try {
      const response = await axios.post(
        `https://api.trollgold.org/persistventures/assignment/setMessage`,
        null,
        {
          params: { message: messageType },
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            message: messageContent,
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage("Message was set successfully!");
        setMessageContent("");
      } else {
        setError("Failed to set the message. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while setting the message.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Set Message Template</h1>
        <p className="text-gray-600 mb-6">Create and update message templates.</p>

        <div className="space-y-6">
          {/* Message Type Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Message Type <span className="text-red-500">*</span>
            </label>
            <select
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="invite_message">Invite Message</option>
              <option value="assignment_message">Assignment Message</option>
              <option value="hired_message">Hired Message</option>
            </select>
          </div>

          {/* Message Content Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Enter your message content here..."
              rows={6}
              maxLength={1000}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <div className="text-gray-500 text-sm mt-1 text-right">
              {messageContent.length} / 1000
            </div>
          </div>

          {/* Send Message Button */}
          <button
            onClick={handleSendMessage}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Template
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

export default SendMessagePage;
