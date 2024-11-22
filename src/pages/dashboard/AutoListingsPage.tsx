import { useState } from "react";

const AutoListingsPage = () => {
  const [empType, setEmpType] = useState("internship");
  const [account, setAccount] = useState("Org 1");
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("table"); // Switch between table and card view

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://api.trollgold.org/persistventures/assignment/get_listings?emp_type=internship&account=Org%201",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            emp_type: empType,
            account: account,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch listings. Please try again.");
      }

      const fetchedData = await response.json();
      setData(fetchedData);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = () => {
    fetchListings();
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Get Listings</h1>
        </div>
        <p className="text-gray-600 mb-6">
          View all automated and non-automated listings.
        </p>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Employment Type <span className="text-red-500">*</span>
            </label>
            <select
              value={empType}
              onChange={(e) => setEmpType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="internship">Internship</option>
              <option value="job">Job</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Account <span className="text-red-500">*</span>
            </label>
            <select
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Org 1">Organization One</option>
              <option value="Org 2">Organization Two</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleFetch}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition w-full"
            >
              Fetch Listings
            </button>
          </div>
        </div>

        {/* Error and Loading States */}
        {loading && <p className="text-gray-500">Fetching listings...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Tabs for Table and Card View */}
        {!loading && !error && data && (
          <div className="mt-6">
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setActiveTab("table")}
                className={`px-4 py-2 rounded ${
                  activeTab === "table"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setActiveTab("card")}
                className={`px-4 py-2 rounded ${
                  activeTab === "card"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                Card View
              </button>
            </div>

            {/* Table View */}
            {activeTab === "table" && (
              <>
                <h2 className="text-xl font-bold text-blue-600 mb-4">
                  Automated Listings
                </h2>
                {data.automated?.length > 0 ? (
                  <table className="w-full border-collapse bg-white border border-gray-300 mb-8">
                    <thead>
                      <tr>
                        <th className="border-b p-4 text-left text-gray-700 font-medium">
                          Listing Name
                        </th>
                        <th className="border-b p-4 text-left text-gray-700 font-medium">
                          Listing Number
                        </th>
                        <th className="border-b p-4 text-left text-gray-700 font-medium">
                          Project Name
                        </th>
                        <th className="border-b p-4 text-left text-gray-700 font-medium">
                          Date
                        </th>
                        <th className="border-b p-4 text-left text-gray-700 font-medium">
                          Assignment Links
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.automated.map((listing: any, index: number) => (
                        <tr key={index}>
                          <td className="border-b p-4 text-gray-600">
                            {listing.listing_name}
                          </td>
                          <td className="border-b p-4 text-gray-600">
                            {listing.listing_number}
                          </td>
                          <td className="border-b p-4 text-gray-600">
                            {listing.projectname}
                          </td>
                          <td className="border-b p-4 text-gray-600">
                            {listing.date}
                          </td>
                          <td className="border-b p-4 text-blue-500">
                            {listing.assignment_link.join(", ")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">No automated listings found.</p>
                )}

                <h2 className="text-xl font-bold text-green-600 mb-4">
                  Not Automated Listings
                </h2>
                {data.not_automated?.length > 0 ? (
                  <table className="w-full border-collapse bg-white border border-gray-300">
                    <thead>
                      <tr>
                        <th className="border-b p-4 text-left text-gray-700 font-medium">
                          Listing Name
                        </th>
                        <th className="border-b p-4 text-left text-gray-700 font-medium">
                          Listing Number
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.not_automated.map((listing: any, index: number) => (
                        <tr key={index}>
                          <td className="border-b p-4 text-gray-600">
                            {listing.listing_name}
                          </td>
                          <td className="border-b p-4 text-gray-600">
                            {listing.listing_number}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">No not automated listings found.</p>
                )}
              </>
            )}

            {/* Card View */}
            {activeTab === "card" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.automated?.map((listing: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-300 p-4 rounded shadow"
                  >
                    <h3 className="text-lg font-bold text-blue-600 mb-2">
                      {listing.listing_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <strong>Listing Number:</strong> {listing.listing_number}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Project Name:</strong> {listing.projectname}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Date:</strong> {listing.date}
                    </p>
                    <p className="text-sm text-blue-500">
                      <strong>Assignment Links:</strong>{" "}
                      {listing.assignment_link.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoListingsPage;
