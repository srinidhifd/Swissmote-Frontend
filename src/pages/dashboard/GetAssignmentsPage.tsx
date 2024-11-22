import React, { useState } from "react";

const GetAssignmentsPage: React.FC = () => {
  const [listingNumber, setListingNumber] = useState("");
  const [rowData, setRowData] = useState("");
  const [offsetData, setOffsetData] = useState("");
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchAssignments = async () => {
    if (!listingNumber.trim() || !rowData.trim() || !offsetData.trim()) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError(null);
    setAssignments([]);

    try {
      const response = await fetch(
        "https://api.trollgold.org/persistventures/assignment/getAssignments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            listing: Number(listingNumber),
            row_data: Number(rowData),
            offset_data: Number(offsetData),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch assignments. Please try again.");
      }

      const data = await response.json();
      const formattedData = Object.values(data);
      setAssignments(formattedData);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Get Assignments</h1>
        <p className="text-gray-600 mb-8">
          View and manage assignment submissions.
        </p>

        {/* Input Form */}
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
              Row Data <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={rowData}
              onChange={(e) => setRowData(e.target.value)}
              placeholder="e.g., 3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Offset Data <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={offsetData}
              onChange={(e) => setOffsetData(e.target.value)}
              placeholder="e.g., 2"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Fetch Assignments Button */}
        <div className="flex justify-start mb-8">
          <button
            onClick={handleFetchAssignments}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Fetch Assignments
          </button>
        </div>

        {/* Error and Loading States */}
        {loading && <p className="text-gray-500">Loading assignments...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Assignments Table */}
        {assignments.length > 0 && (
          <div className="overflow-x-auto mt-4">
            <table className="w-full bg-white border border-gray-300 rounded-md shadow-md">
              <thead className="bg-gray-100 rounded-t-md">
                <tr>
                  <th className="p-4 text-left text-gray-700 font-semibold border-b border-gray-300">
                    Name
                  </th>
                  <th className="p-4 text-left text-gray-700 font-semibold border-b border-gray-300">
                    Status
                  </th>
                  <th className="p-4 text-left text-gray-700 font-semibold border-b border-gray-300">
                    From
                  </th>
                  <th className="p-4 text-left text-gray-700 font-semibold border-b border-gray-300">
                    Received On
                  </th>
                  <th className="p-4 text-left text-gray-700 font-semibold border-b border-gray-300">
                    Location
                  </th>
                  <th className="p-4 text-left text-gray-700 font-semibold border-b border-gray-300">
                    Experience
                  </th>
                  <th className="p-4 text-left text-gray-700 font-semibold border-b border-gray-300">
                    Relocation
                  </th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="p-4 border-b border-gray-300 text-gray-900 font-medium">
                      {assignment.name}
                    </td>
                    <td className="p-4 border-b border-gray-300">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                        {assignment.status}
                      </span>
                    </td>
                    <td className="p-4 border-b border-gray-300 text-gray-600">
                      {assignment.from}
                    </td>
                    <td className="p-4 border-b border-gray-300 text-gray-600">
                      {assignment.recieved_on}
                    </td>
                    <td className="p-4 border-b border-gray-300 text-gray-600">
                      {assignment.location}
                    </td>
                    <td className="p-4 border-b border-gray-300 text-gray-600">
                      {assignment.job_expreince}
                    </td>
                    <td className="p-4 border-b border-gray-300 text-center">
                      {assignment.relocation ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                          Yes
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                          No
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetAssignmentsPage;
