import { useState } from "react";
import axios from "axios";

const MessagesPage = () => {
  const [messageType, setMessageType] = useState("invite_message");
  const [messageData, setMessageData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMessage = async () => {
    setError(null);
    setMessageData(null);
    try {
      const response = await axios.get(
        `https://api.trollgold.org/persistventures/assignment/getMessage`,
        {
          params: { message: messageType },
        }
      );
      setMessageData(response.data.message);
    } catch (err) {
      setError("Failed to fetch message. Please try again.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Message Templates</h1>
        <p className="text-gray-600 mb-6">
          Get pre-defined message templates for different scenarios.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchMessage();
          }}
          className="space-y-6"
        >
          {/* Select Message Type */}
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

          {/* Fetch Message Button */}
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Fetch Message Template
          </button>
        </form>

        {/* Display Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Display Fetched Message */}
        {messageData && (
          <div className="mt-6 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">
              Retrieved Message:
            </h3>
            <p className="text-gray-700">{messageData}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
