import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import { BsReply, BsArrowLeft } from "react-icons/bs";
import { AiOutlineClockCircle } from "react-icons/ai";

interface Question {
  chat_id: number;
  message_id: number | null;
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
  const [replyMessage, setReplyMessage] = useState<string>("");
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
  const [replyLoading, setReplyLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!listingNumber) {
      toast.error("No listing number provided");
      navigate("/dashboard/listings/auto");
      return;
    }
    fetchQuestions();
  }, [listingNumber]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${apiUrl}/getQuestions`, {
        params: { listing: listingNumber },
        headers: { Authorization: `Bearer ${authToken}` },
      });
      
      if (response.data.success) {
        setQuestions(response.data.questions || []);
        if (response.data.questions?.length === 0) {
          toast.info("No questions found for this listing");
        }
      } else {
        throw new Error(response.data.message || "Failed to fetch questions.");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch questions";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (chatId: number, messageId: number | null) => {
    if (!replyMessage.trim()) {
      toast.error("Reply message cannot be empty");
      return;
    }

    setReplyLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/reply_question?listing=${listingNumber}`,
        { chat_id: chatId, message_id: messageId, message: replyMessage },
        { headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" } }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to send reply");
      }

      toast.success("Reply sent successfully");
      setReplyMessage("");
      setSelectedMessageId(null);
      await fetchQuestions(); // Refresh questions after reply
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to send reply";
      toast.error(errorMessage);
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" />
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
            >
              <BsArrowLeft className="mr-2" /> Back
            </button>
            <h1 className="text-4xl font-semibold text-gray-800">Manage Questions</h1>
            <p className="text-gray-600 mt-2">
              Listing <span className="font-semibold">#{listingNumber}</span>
            </p>
          </div>
          <button
            onClick={fetchQuestions}
            className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
          >
            Refresh Questions
          </button>
        </div>

        {/* Content Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <TailSpin height="50" width="50" color="#4fa94d" ariaLabel="loading" />
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchQuestions}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
              >
                Try Again
              </button>
            </div>
          ) : questions.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No questions found for this listing</p>
          ) : (
            <div className="space-y-6">
              {questions.map((q) => (
                <div key={q.message_id || q.chat_id} className="border p-6 rounded-lg shadow-sm hover:shadow-md transition bg-gray-50">
                  {/* Question Section */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-lg font-medium text-gray-800">{q.question}</h2>
                      <div className="flex items-center text-gray-500 text-sm mt-2">
                        <AiOutlineClockCircle className="mr-1" />
                        {new Date(q.time_stamp).toLocaleString()}
                      </div>
                      
                      {/* Attachments */}
                      {(q.links?.length ?? 0) > 0 && (
                        <div className="mt-4 space-y-2">
                          {q.links?.map((link, idx) => (
                            /\.(jpg|jpeg|png|gif)$/.test(link) ? (
                              <img
                                key={idx}
                                src={link}
                                alt="Attachment"
                                className="max-w-xs rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
                                onClick={() => window.open(link, '_blank')}
                              />
                            ) : (
                              <a
                                key={idx}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-blue-600 hover:text-blue-800 hover:underline transition"
                              >
                                View Attachment {idx + 1}
                              </a>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => setSelectedMessageId(q.message_id)}
                      className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 transition"
                    >
                      <BsReply className="mr-2" /> Reply
                    </button>
                  </div>

                  {/* Reply Section */}
                  {selectedMessageId === q.message_id && (
                    <div className="mt-4 bg-white p-4 rounded-lg border">
                      <textarea
                        rows={3}
                        placeholder="Type your reply here..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
                      />
                      <div className="flex justify-end mt-3 space-x-3">
                        <button
                          onClick={() => {
                            setSelectedMessageId(null);
                            setReplyMessage("");
                          }}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleReply(q.chat_id, q.message_id)}
                          disabled={replyLoading}
                          className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {replyLoading ? "Sending..." : "Send Reply"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetQuestionsPage;
