import { useState } from "react";
import axios from "axios";

const MessagesPage = () => {
  const [messageType, setMessageType] = useState("invite_message");
  const [messageData, setMessageData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMessage = async () => {
    try {
      const response = await axios.get(
        `https://api.trollgold.org/persistventures/assignment/getMessage`,
        {
          params: { message: messageType },
        }
      );
      setMessageData(response.data.message);
      setError(null);
    } catch (err) {
      setError("Failed to fetch message. Please try again.");
      setMessageData(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Messages</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <label
            htmlFor="messageType"
            className="block text-sm font-medium text-gray-600"
          >
            Select Message Type
          </label>
          <select
            id="messageType"
            value={messageType}
            onChange={(e) => setMessageType(e.target.value)}
            className="mt-2 block w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="invite_message">Invite Message</option>
            <option value="assignment_message">Assignment Message</option>
            <option value="hired_message">Hired Message</option>
          </select>
        </div>

        <button
          onClick={fetchMessage}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition-all"
        >
          Fetch Message
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {messageData && (
          <div className="mt-4 p-4 bg-gray-100 border border-gray-200 rounded-lg">
            <h2 className="text-sm font-medium text-gray-800 mb-2">
              Retrieved Message:
            </h2>
            <p className="text-gray-700">{messageData}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
