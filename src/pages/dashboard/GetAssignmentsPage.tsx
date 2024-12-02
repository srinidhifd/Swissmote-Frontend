import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';

const GetAssignmentsPage: React.FC = () => {
  const location = useLocation();
  const { listingNumber, source } = location.state || {};

  const [rowData, setRowData] = useState<number>(10);
  const [offsetData, setOffsetData] = useState<number>(0);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (listingNumber && source) {
      handleFetchAssignments();
    }
  }, [listingNumber, source]);

  const handleFetchAssignments = async () => {
    if (!listingNumber || !source) {
      setError("Listing Number and Source are required.");
      return;
    }

    setLoading(true);
    setError(null);
    setAssignments([]);

    try {
      const response = await fetch(
        "https://api.trollgold.org/get_assignments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJOaXRlc2giLCJleHAiOjE3MzI5NzM1OTd9.7HJ2YFcF16nhTnqY_-Ji5maM2T4TPnVwNt8Hvw-kl_8`,
          },
          body: JSON.stringify({
            listing: listingNumber,
            source: source,
            row_data: rowData,
            offset_data: offsetData,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch assignments. Please try again.");
      }

      const data = await response.json();
      setAssignments(data.assignments || []);
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
        <p className="text-gray-600 mb-8">View and manage assignment submissions.</p>

        {/* Error and Loading States */}
        {loading && <p className="text-gray-500">Loading assignments...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Assignments Table */}
        {assignments.length > 0 && (
          <div className="overflow-x-auto mt-4">
            <table className="w-full bg-white border border-gray-300 rounded-md shadow-md">
              <thead className="bg-gray-100 rounded-t-md">
                <tr>
                  <th className="p-4 text-left text-gray-700 font-semibold border-b border-gray-300">Name</th>
                  <th className="p-4 text-left text-gray-700 font-semibold border-b border-gray-300">Status</th>
                  <th className="p-4 text-left text-gray-700 font-semibold border-b border-gray-300">From</th>
                  <th className="p-4 text-left text-gray-700 font-semibold border-b border-gray-300">Received On</th>
                  <th className="p-4 text-left text-gray-700 font-semibold border-b border-gray-300">Location</th>
                  <th className="p-4 text-left text-gray-700 font-semibold border-b border-gray-300">Experience</th>
                  <th className="p-4 text-left text-gray-700 font-semibold border-b border-gray-300">Relocation</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="p-4 border-b border-gray-300 text-gray-900 font-medium">{assignment.name}</td>
                    <td className="p-4 border-b border-gray-300">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                        {assignment.status}
                      </span>
                    </td>
                    <td className="p-4 border-b border-gray-300 text-gray-600">{assignment.from}</td>
                    <td className="p-4 border-b border-gray-300 text-gray-600">{assignment.received_on}</td>
                    <td className="p-4 border-b border-gray-300 text-gray-600">{assignment.location}</td>
                    <td className="p-4 border-b border-gray-300 text-gray-600">{assignment.job_experience}</td>
                    <td className="p-4 border-b border-gray-300 text-center">
                      {assignment.relocation ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Yes</span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">No</span>
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
