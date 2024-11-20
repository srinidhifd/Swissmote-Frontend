import { useState } from "react";
import axios from "axios";

interface Update {
  id: number;
  chat_id: number;
  Update: string;
  time_stamp: string;
}

const DailyUpdatesPage = () => {
  const [listing, setListing] = useState("");
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [error, setError] = useState("");

  const fetchUpdates = async () => {
    setError("");
    setUpdates([]);

    if (!listing) {
      setError("Listing ID is required.");
      return;
    }

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
      setUpdates(response.data.daily_updates || []);
    } catch (err) {
      setError("Failed to fetch updates. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Daily Updates</h1>

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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="offset"
                className="block text-sm font-medium text-gray-700"
              >
                Offset
              </label>
              <input
                type="number"
                id="offset"
                value={offset}
                onChange={(e) => setOffset(Number(e.target.value))}
                placeholder="Enter offset"
                className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="limit"
                className="block text-sm font-medium text-gray-700"
              >
                Limit
              </label>
              <input
                type="number"
                id="limit"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                placeholder="Enter limit"
                className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={fetchUpdates}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Fetch Updates
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-800 rounded-md">
            <strong>Error:</strong> {error}
          </div>
        )}

        {updates.length > 0 && (
          <div className="mt-6 space-y-4">
            {updates.map((update) => (
              <div
                key={update.id}
                className="p-4 bg-gray-100 rounded-lg shadow border border-gray-200"
              >
                <p>
                  <strong>Chat ID:</strong> {update.chat_id}
                </p>
                <p>
                  <strong>Update:</strong> {update.Update}
                </p>
                <p>
                  <strong>Timestamp:</strong>{" "}
                  {new Date(update.time_stamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyUpdatesPage;
