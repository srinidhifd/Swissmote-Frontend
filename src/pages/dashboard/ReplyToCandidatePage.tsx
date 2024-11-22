import React, { useState } from "react";
import axios from "axios";

const ReplyToCandidatePage: React.FC = () => {
  const [listingNumber, setListingNumber] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!listingNumber || !candidateId || !message) {
      setError("Listing number, candidate ID, and message are required.");
      return;
    }

    try {
      const response = await axios.post(
        `https://api.trollgold.org/persistventures/assignment/replyCandidate`,
        {
          candidate_id: Number(candidateId),
          message,
        },
        {
          params: {
            listing_num: listingNumber,
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage("Message sent successfully.");
        setListingNumber("");
        setCandidateId("");
        setMessage("");
      } else {
        setError("Failed to send the message. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while sending the message.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Reply to Candidate</h1>
        <p className="text-gray-600 mb-6">Send a response to a specific candidate.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="p-4 bg-green-100 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Listing Number <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={listingNumber}
                onChange={(e) => setListingNumber(e.target.value)}
                placeholder="Enter listing number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reply Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your reply message here..."
              rows={6}
              maxLength={1000}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <div className="text-gray-500 text-sm mt-1 text-right">
              {message.length} / 1000
            </div>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send Reply
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReplyToCandidatePage;
