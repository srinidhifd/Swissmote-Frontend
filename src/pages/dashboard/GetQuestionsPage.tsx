import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Question {
  chat_id: number;
  type: string;
  question: string;
  links?: string[];
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
  const [replyMessage, setReplyMessage] = useState<string>("");
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [replyLoading, setReplyLoading] = useState(false);

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
        setError(data.detail);
      } else {
        setError("Failed to fetch questions. Please try again.");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to fetch questions. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (chatId: number) => {
    if (!replyMessage.trim()) {
      toast.error("Reply message cannot be empty.");
      return;
    }

    setReplyLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/reply_question?listing=${listingNumber}`,
        { chat_id: chatId, message: replyMessage },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Reply sent successfully.");
        setReplyMessage("");
        setSelectedChatId(null);
      } else {
        toast.error("Failed to send the reply.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to send the reply.");
    } finally {
      setReplyLoading(false);
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
      <ToastContainer />
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Get Questions</h1>
        <p className="text-gray-600 mb-6">View and manage listing questions for listing #{listingNumber}</p>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center mt-6">
            <TailSpin height="50" width="50" color="#4fa94d" />
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <div
                key={question.chat_id}
                className="bg-gray-100 p-4 rounded-lg shadow-sm flex justify-between items-start"
              >
                <div>
                  <p className="font-medium text-gray-800">{question.question}</p>
                  {question.links && (
                    <div className="mt-2">
                      {question.links.map((link, index) =>
                        /\.(jpg|jpeg|png|gif)$/.test(link) ? (
                          <img
                            key={index}
                            src={link}
                            alt="Attachment"
                            className="w-32 h-32 object-cover rounded-md border mt-2"
                          />
                        ) : (
                          <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 text-sm underline mt-2 block"
                          >
                            View File
                          </a>
                        )
                      )}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(question.time_stamp).toLocaleString()} | {question.type}
                  </p>
                </div>
                <div>
                  {selectedChatId === question.chat_id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type your reply..."
                        className="p-2 border border-gray-300 rounded-md flex-1"
                      />
                      <button
                        onClick={() => handleReply(question.chat_id)}
                        disabled={replyLoading}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        {replyLoading ? "Sending..." : "Send"}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedChatId(question.chat_id);
                        setReplyMessage(""); // Clear previous reply message
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Reply
                    </button>
                  )}
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
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
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 bg-gray-300 rounded-lg text-gray-800 ${
                    currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GetQuestionsPage;
