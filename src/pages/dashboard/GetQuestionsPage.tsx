import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsReply } from "react-icons/bs";
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

  useEffect(() => {
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
      } else {
        setError("Failed to fetch questions.");
      }
    } catch (err) {
      setError("Failed to fetch questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (chatId: number, messageId: number | null) => {
    if (!replyMessage.trim()) {
      toast.error("Reply message cannot be empty.");
      return;
    }

    setReplyLoading(true);
    try {
      await axios.post(
        `${apiUrl}/reply_question?listing=${listingNumber}`,
        { chat_id: chatId, message_id: messageId, message: replyMessage },
        { headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" } }
      );
      toast.success("Reply sent successfully.");
      setReplyMessage("");
      setSelectedMessageId(null);
      fetchQuestions();
    } catch {
      toast.error("Failed to send reply. Please try again.");
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-4xl font-semibold mb-6 text-gray-800">Manage Questions</h1>
        <p className="text-gray-500 mb-4">
          View and reply to questions for listing <span className="font-semibold">#{listingNumber}</span>
        </p>

        {loading ? (
          <div className="flex justify-center py-10">
            <TailSpin height="50" width="50" color="#4fa94d" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="space-y-6">
            {questions.map((q) => (
              <div key={q.message_id || q.chat_id} className="border p-4 rounded-lg shadow-md bg-gray-50">
                {/* Question Section */}
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-lg font-medium text-gray-700">{q.question}</h2>
                    <div className="flex items-center text-gray-500 text-sm mt-2">
                      <AiOutlineClockCircle className="mr-1" />
                      {new Date(q.time_stamp).toLocaleString()}
                    </div>
                    {q.links?.map((link, idx) =>
                      /\.(jpg|jpeg|png|gif)$/.test(link) ? (
                        <img
                          key={idx}
                          src={link}
                          alt="Attachment"
                          className="mt-4 w-40 h-40 object-cover rounded-md shadow"
                        />
                      ) : (
                        <a
                          key={idx}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline block mt-2"
                        >
                          View Attachment
                        </a>
                      )
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedMessageId(q.message_id)}
                    className="text-blue-500 hover:text-blue-700 flex items-center"
                  >
                    <BsReply className="mr-1" /> Reply
                  </button>
                </div>

                {/* Reply Section */}
                {selectedMessageId === q.message_id && (
                  <div className="mt-4">
                    <textarea
                      rows={3}
                      placeholder="Type your reply here..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="w-full p-2 border rounded-md shadow-inner focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    ></textarea>
                    <button
                      onClick={() => handleReply(q.chat_id, q.message_id)}
                      disabled={replyLoading}
                      className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 disabled:bg-blue-300"
                    >
                      {replyLoading ? "Sending..." : "Send Reply"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GetQuestionsPage;
