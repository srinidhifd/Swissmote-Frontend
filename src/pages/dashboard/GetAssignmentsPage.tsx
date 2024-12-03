import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { FaCheckCircle, FaTimesCircle, FaDownload } from "react-icons/fa";

const GetAssignmentsPage: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const authToken = import.meta.env.VITE_AUTH_TOKEN;

  const location = useLocation();
  const { listingNumber, source } = location.state || {};

  const [rowData] = useState<number>(10);
  const [offsetData, setOffsetData] = useState<number>(0);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (listingNumber && source) {
      handleFetchAssignments();
    } else {
      setError("Missing listingNumber or source in navigation state.");
    }
  }, [listingNumber, source, offsetData]);

  const handleFetchAssignments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/get_assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          listing: listingNumber,
          source,
          row_data: rowData,
          offset_data: offsetData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch assignments. Please try again.");
      }

      const data = await response.json();

      if (data.success && data.data) {
        const parsedAssignments = Object.values(data.data);
        setAssignments(parsedAssignments);
        setTotalRecords(data.count || 0);
      } else {
        setAssignments([]);
        setError("No assignments found or invalid response format.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setOffsetData((newPage - 1) * rowData);
  };

  const renderAttachments = (attachments: any[]) => {
    return attachments.map((attachment: any, index: number) => (
      <a
        key={index}
        href={attachment[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline flex items-center"
      >
        {attachment[1]} <FaDownload className="ml-2" />
      </a>
    ));
  };

  const filteredAssignments = assignments.filter((assignment) => {
    if (filter === "evaluated") return assignment.evaluated;
    if (filter === "future") return assignment.future_consideration;
    return true;
  });

  const toggleStatus = (assignment: any, field: string) => {
    assignment[field] = !assignment[field];
    setAssignments([...assignments]);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Get Assignments</h1>
        <p className="text-gray-600 mb-8">View and manage assignment submissions.</p>

        {/* Filter Dropdown */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredAssignments.length} of {totalRecords} records
          </p>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All</option>
            <option value="evaluated">Evaluated</option>
            <option value="future">Future Consideration</option>
          </select>
        </div>

        {loading && (
          <div className="flex justify-center items-center mb-6">
            <TailSpin height="80" width="80" color="#4fa94d" ariaLabel="loading" />
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}

        {filteredAssignments.length > 0 ? (
          <div className="space-y-6">
            {filteredAssignments.map((assignment: any, index: number) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-md p-6 border border-gray-300 flex justify-between"
              >
                {/* Left Section */}
                <div className="w-1/2">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">{assignment.name}</h2>
                  <p className="text-gray-600">
                    <strong>From:</strong> {assignment.from}
                  </p>
                  <p className="text-gray-600">
                    <strong>Received On:</strong> {assignment.recieved_on}
                  </p>
                  <p className="text-gray-600">
                    <strong>Location:</strong> {assignment.location}
                  </p>
                  <p className="text-gray-600">
                    <strong>Experience:</strong> {assignment.job_expreince}
                  </p>
                  <p className="text-gray-600">
                    <strong>Relocation:</strong> {assignment.relocation ? "Yes" : "No"}
                  </p>
                </div>

                {/* Right Section */}
                <div className="w-1/2">
                  <div>
                    <strong>Attachments:</strong>
                    <div className="space-y-2 mt-2 overflow-hidden">
                      {assignment.assignment?.length > 0
                        ? renderAttachments(assignment.assignment)
                        : "No attachments"}
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-6">
                    <button
                      onClick={() => toggleStatus(assignment, "evaluated")}
                      className={`px-4 py-2 flex items-center rounded-md text-white ${
                        assignment.evaluated ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    >
                      {assignment.evaluated ? (
                        <>
                          <FaCheckCircle className="mr-2" /> Evaluated
                        </>
                      ) : (
                        <>
                          <FaTimesCircle className="mr-2" /> Mark as Evaluated
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => toggleStatus(assignment, "future_consideration")}
                      className={`px-4 py-2 flex items-center rounded-md text-white ${
                        assignment.future_consideration ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    >
                      {assignment.future_consideration ? (
                        <>
                          <FaCheckCircle className="mr-2" /> Marked for Future Consideration
                        </>
                      ) : (
                        <>
                          <FaTimesCircle className="mr-2" /> Mark for Future Consideration
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && <p>No assignments found.</p>
        )}

        {/* Pagination */}
        {filteredAssignments.length > 0 && (
          <div className="flex justify-between items-center mt-6">
            <p className="text-gray-600">
              Showing {currentPage} of {Math.ceil(totalRecords / rowData)} pages
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${
                  currentPage === 1 ? "bg-gray-300 text-gray-500" : "bg-blue-500 text-white"
                }`}
              >
                Previous
              </button>
              {[...Array(Math.ceil(totalRecords / rowData))].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === Math.ceil(totalRecords / rowData)}
                className={`px-4 py-2 rounded ${
                  currentPage === Math.ceil(totalRecords / rowData)
                    ? "bg-gray-300 text-gray-500"
                    : "bg-blue-500 text-white"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetAssignmentsPage;
