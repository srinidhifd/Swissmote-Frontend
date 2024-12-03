import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

interface Question {
  id: number;
  chat_id: number;
  type: string;
  question: string;
  time_stamp: string;
}

const GetQuestionsPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const authToken = import.meta.env.VITE_AUTH_TOKEN;

  const location = useLocation();
  const { listingNumber } = location.state || {};

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    if (listingNumber) {
      fetchQuestions();
    } else {
      setError("Listing number is missing. Unable to fetch questions.");
    }
  }, [offset, limit, listingNumber]);

  const fetchQuestions = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await axios.get(`${apiUrl}/getQuestions`, {
        params: { listing: listingNumber, offset, limit },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = response.data;

      if (data.success) {
        setQuestions(data.questions || []);
        setTotalPages(data.pagination.total_pages || 1);
      } else if (data.detail) {
        // Show error detail if provided in the response
        setError(data.detail);
      } else {
        setError("Failed to fetch questions. Please try again.");
      }
    } catch (err: any) {
      // Handle Axios error and show a default error message
      setError(err.response?.data?.detail || "Failed to fetch questions. Please check your connection.");
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
        <h1 className="text-3xl font-bold mb-4 text-gray-800"> Get Questions</h1>
        <p className="text-gray-600 mb-6">View and manage listing questions for listing #{listingNumber}</p>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center mt-6">
            <p className="text-gray-500">Loading...</p>
          </div>
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
                      <th className="p-4 text-left">Type</th>
                      <th className="p-4 text-left">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((question) => (
                      <tr key={question.id} className="border-t border-gray-200">
                        <td className="p-4">{question.id}</td>
                        <td className="p-4">{question.question}</td>
                        <td className="p-4">{question.type}</td>
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
                  <p>No questions found.</p>
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
