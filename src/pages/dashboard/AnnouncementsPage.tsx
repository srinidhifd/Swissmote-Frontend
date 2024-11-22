import React, { useState } from "react";

const AnnouncementsPage: React.FC = () => {
  const [listingNumber, setListingNumber] = useState("");
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const maxMessageLength = 500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!listingNumber.trim() || !announcementMessage.trim()) {
      setError("Both listing number and announcement message are required.");
      return;
    }

    try {
      const response = await fetch(
        "https://api.trollgold.org/persistventures/assignment/announcement",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            listing: Number(listingNumber),
            message: announcementMessage,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send the announcement. Please try again.");
      }

      const result = await response.json();
      setSuccessMessage(result.message || "Announcement is initiated successfully.");
      setListingNumber("");
      setAnnouncementMessage("");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Make Announcement</h1>
        <p className="text-gray-600 mb-8">
          Send announcements to listing participants.
        </p>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
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
              Announcement Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={announcementMessage}
              onChange={(e) =>
                setAnnouncementMessage(e.target.value.slice(0, maxMessageLength))
              }
              placeholder="Enter your announcement message here..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            ></textarea>
            <p className="text-sm text-gray-500 mt-1">
              {announcementMessage.length}/{maxMessageLength}
            </p>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Make Announcement
          </button>
        </form>

      </div>
    </div>
  );
};

export default AnnouncementsPage;
