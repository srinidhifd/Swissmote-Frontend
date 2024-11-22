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
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Chat Messages</h1>
        <p className="text-gray-600 mb-6">View chat messages between listing and candidate.</p>

        <div className="space-y-6">
          {/* Input Fields */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
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
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Candidate ID <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={candidateId}
                onChange={(e) => setCandidateId(e.target.value)}
                placeholder="Enter candidate ID"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Fetch Chat Button */}
          <button
            onClick={fetchChat}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Fetch Chat
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-800 rounded-md">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Chat Messages */}
        {chatMessages.length > 0 && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Retrieved Chat Messages
            </h2>
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col ${
                    message.assignment ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`p-4 max-w-md rounded-lg shadow-md ${
                      message.assignment
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm font-medium mb-1">
                      <strong>{message.assignment ? "Assignment Message" : "Candidate Message"}</strong>
                    </p>
                    <p>{message.message}</p>
                    <p className="mt-1 text-xs text-gray-600">
                      {message.date} at {message.time}
                    </p>

                    {message.assignment && (
                      <div className="mt-2 text-sm text-gray-700">
                        <p>
                          <strong>Assignment Details:</strong> {message.assignment.message}
                        </p>
                        {message.assignment.due_date && (
                          <p>
                            <strong>Due Date:</strong> {message.assignment.due_date}
                          </p>
                        )}
                        {message.assignment.past_due_date_msg && (
                          <p className="text-red-600">
                            <strong>Past Due Date Message:</strong> {message.assignment.past_due_date_msg}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetChatPage;
