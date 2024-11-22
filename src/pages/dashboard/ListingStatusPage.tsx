import { useState } from "react";

const ListingStatusPage = () => {
  const [listingNumber, setListingNumber] = useState("");
  const [account, setAccount] = useState("Org 1");
  const [statusData, setStatusData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckStatus = async () => {
    if (!listingNumber.trim()) {
      setError("Listing number is required.");
      return;
    }

    setLoading(true);
    setError(null);
    setStatusData(null);

    try {
      const response = await fetch(
        "https://api.trollgold.org/persistventures/assignment/listingStatus",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            listing: Number(listingNumber),
            account: account,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch listing status. Please try again.");
      }

      const data = await response.json();
      if (data.success) {
        setStatusData(data);
      } else {
        setError("Failed to retrieve listing status.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Listing Status</h1>
        <p className="text-gray-600 mb-8">
          Check the current status of any listing.
        </p>

        {/* Form to Check Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Listing Number <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={listingNumber}
              onChange={(e) => setListingNumber(e.target.value)}
              placeholder="e.g., 123"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account <span className="text-red-500">*</span>
            </label>
            <select
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Org 1">Organization One</option>
              <option value="Org 2">Organization Two</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleCheckStatus}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition w-full"
            >
              Check Status
            </button>
          </div>
        </div>

        {/* Error and Loading States */}
        {loading && <p className="text-gray-500">Checking listing status...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Display Listing Status */}
        {statusData && (
          <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {statusData.listing_name}
              </h2>
              <span
                className={`${
                  statusData.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                } px-4 py-1 rounded-full text-sm font-medium`}
              >
                {statusData.status}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-6 h-6 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 22c5.421 0 10-4.579 10-10S17.421 2 12 2 2 6.579 2 12s4.579 10 10 10zm0-18c4.421 0 8 3.579 8 8s-3.579 8-8 8-8-3.579-8-8 3.579-8 8-8zm0 14c3.309 0 6-2.691 6-6s-2.691-6-6-6-6 2.691-6 6 2.691 6 6 6z" />
                  </svg>
                  <span className="text-lg font-medium text-gray-700">
                    Total Views
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {statusData.views}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-6 h-6 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 22c5.421 0 10-4.579 10-10S17.421 2 12 2 2 6.579 2 12s4.579 10 10 10zm0-18c4.421 0 8 3.579 8 8s-3.579 8-8 8-8-3.579-8-8 3.579-8 8-8zm0 14c3.309 0 6-2.691 6-6s-2.691-6-6-6-6 2.691-6 6 2.691 6 6 6z" />
                  </svg>
                  <span className="text-lg font-medium text-gray-700">
                    Applications
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {statusData.applications}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-6 h-6 text-orange-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 22c5.421 0 10-4.579 10-10S17.421 2 12 2 2 6.579 2 12s4.579 10 10 10zm0-18c4.421 0 8 3.579 8 8s-3.579 8-8 8-8-3.579-8-8 3.579-8 8-8zm0 14c3.309 0 6-2.691 6-6s-2.691-6-6-6-6 2.691-6 6 2.691 6 6 6z" />
                  </svg>
                  <span className="text-lg font-medium text-gray-700">
                    Expiry Date
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {statusData.expiry_date}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingStatusPage;
