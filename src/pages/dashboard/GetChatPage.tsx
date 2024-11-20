import { useState } from "react";
import axios from "axios";

interface ChatMessage {
  id: number;
  time: string;
  date: string;
  message: string;
  assignment?: {
    message: string;
    due_date?: string;
    past_due_date_msg?: string;
  };
}

const GetChatPage = () => {
  const [listing, setListing] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState("");

  const fetchChat = async () => {
    setError("");
    setChatMessages([]);

    if (!listing || !candidateId) {
      setError("Both Listing ID and Candidate ID are required.");
      return;
    }

    try {
      const response = await axios.get(
        `https://api.trollgold.org/persistventures/assignment/get_chat`,
        {
          params: {
            listing,
            candidate_id: candidateId,
          },
        }
      );
      setChatMessages(response.data.data.chat_messages || []);
    } catch (err) {
      setError("Failed to fetch chat messages. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Chat Messages</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="listing"
              className="block text-sm font-medium text-gray-700"
            >
              Listing ID
            </label>
            <input
              type="number"
              id="listing"
              value={listing}
              onChange={(e) => setListing(e.target.value)}
              placeholder="Enter listing ID"
              className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="candidateId"
              className="block text-sm font-medium text-gray-700"
            >
              Candidate ID
            </label>
            <input
              type="number"
              id="candidateId"
              value={candidateId}
              onChange={(e) => setCandidateId(e.target.value)}
              placeholder="Enter candidate ID"
              className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            onClick={fetchChat}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Fetch Chat
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-800 rounded-md">
            <strong>Error:</strong> {error}
          </div>
        )}

        {chatMessages.length > 0 && (
          <div className="mt-6 space-y-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Retrieved Chat Messages
            </h2>
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className="p-4 bg-gray-100 rounded-lg shadow border border-gray-200"
              >
                <p>
                  <strong>Time:</strong> {message.time}
                </p>
                <p>
                  <strong>Date:</strong> {message.date}
                </p>
                <p>
                  <strong>Message:</strong> {message.message}
                </p>
                {message.assignment && (
                  <>
                    <p>
                      <strong>Assignment:</strong> {message.assignment.message}
                    </p>
                    {message.assignment.due_date && (
                      <p>
                        <strong>Due Date:</strong> {message.assignment.due_date}
                      </p>
                    )}
                    {message.assignment.past_due_date_msg && (
                      <p>
                        <strong>Past Due Date Message:</strong>{" "}
                        {message.assignment.past_due_date_msg}
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GetChatPage;
