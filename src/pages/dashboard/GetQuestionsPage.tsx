import { useState, useEffect } from "react";
import axios from "axios";

interface Question {
  id: number;
  chat_id: number;
  type: string;
  question: string;
  time_stamp: string;
}

const GetQuestionsPage = () => {
  const [listing, setListing] = useState("");
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (listing) {
      fetchQuestions();
    }
  }, [offset, limit]);

  const fetchQuestions = async () => {
    setError("");
    setLoading(true);
    setQuestions([]);

    if (!listing) {
      setError("Listing ID is required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://api.trollgold.org/persistventures/assignment/getQuestions`,
        {
          params: {
            listing,
            offset,
            limit,
          },
        }
      );

      if (response.data.success) {
        setQuestions(response.data.questions || []);
        setTotalPages(response.data.pagination.total_pages);
      } else {
        setError("Failed to fetch questions. Please try again.");
      }
    } catch (err) {
      setError("Failed to fetch questions. Please try again.");
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

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Questions</h1>
        <p className="text-gray-600 mb-6">View and manage listing questions</p>

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
            onClick={fetchQuestions}
            className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Search
          </button>
          <button
            onClick={() => {
              setListing("");
              setQuestions([]);
              setError("");
            }}
            className="px-4 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none"
          >
            Clear
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <>
            {/* Questions Table */}
            {questions.length > 0 ? (
              <div className="overflow-x-auto mt-6">
                <table className="min-w-full bg-white rounded-lg shadow-md">
                  <thead className="bg-blue-500 text-white">
                    <tr>
                      <th className="p-4 text-left">Question ID</th>
                      <th className="p-4 text-left">Question</th>
                      <th className="p-4 text-left">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((question) => (
                      <tr key={question.id} className="border-t border-gray-200">
                        <td className="p-4">{question.id}</td>
                        <td className="p-4">
                          <p className="font-semibold">{question.type}</p>
                          <p>{question.question}</p>
                        </td>
                        <td className="p-4">
                          {new Date(question.time_stamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              !loading && (
                <div className="mt-6 p-6 text-gray-500 text-center">
                  <div className="text-6xl mb-4">📂</div>
                  <p>No data available</p>
                </div>
              )
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`px-4 py-2 bg-gray-300 rounded-lg text-gray-800 ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-400"
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
          </>
        )}
      </div>
    </div>
  );
};

export default GetQuestionsPage;
