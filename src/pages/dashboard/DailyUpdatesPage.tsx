import React, { useState, useEffect } from "react";
import axios from "axios";

const DailyUpdatesPage: React.FC = () => {
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listing, setListing] = useState<string>("123"); // Default listing number
  const [offset, setOffset] = useState<number>(0);
  const [limit] = useState<number>(10); // Items per page
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<string>("latest");

  useEffect(() => {
    fetchUpdates();
  }, [listing, offset, sortOrder]);

  const fetchUpdates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.trollgold.org/persistventures/assignment/getUpdates`,
        {
          params: {
            listing,
            offset,
            limit,
          },
        }
      );

      if (response.data.success) {
        setUpdates(response.data.daily_updates);
        setTotalPages(response.data.pagination.total_pages);
      } else {
        throw new Error("Failed to fetch daily updates.");
      }
    } catch (err) {
      setError("Error fetching daily updates.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setOffset((newPage - 1) * limit);
      setCurrentPage(newPage);
    }
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Daily Updates</h1>
        <p className="text-gray-600 mb-6">View and manage daily update messages</p>

        {/* Search Section */}
        <div className="flex items-center space-x-4 mb-6">
          <input
            type="text"
            value={listing}
            onChange={(e) => setListing(e.target.value)}
            placeholder="Enter listing number"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchUpdates}
            className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Search
          </button>
        </div>

        {/* Sorting Section */}
        <div className="flex items-center mb-6">
          <label htmlFor="sortOrder" className="mr-4 text-sm text-gray-700">
            Sort By:
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={handleSortOrderChange}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-4">
            {/* Updates Display */}
            {updates.length > 0 ? (
              updates.map((update) => (
                <div
                  key={update.id}
                  className="p-6 bg-white shadow rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between mb-2">
                    <div className="text-gray-600 text-sm">
                      <span className="block text-blue-500 font-semibold">
                        Chat ID: {update.chat_id}
                      </span>
                      {new Date(update.time_stamp).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      {new Date(update.time_stamp).toLocaleTimeString("en-US")}
                    </div>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                    >
                      Reply
                    </button>
                  </div>
                  <p className="text-gray-800">{update.Update}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No updates found for this listing.</p>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className={`px-4 py-2 bg-gray-300 rounded-lg text-gray-800 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className={`px-4 py-2 bg-gray-300 rounded-lg text-gray-800 ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-400"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyUpdatesPage;
