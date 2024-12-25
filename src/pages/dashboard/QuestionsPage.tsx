import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";
import { BsReply} from "react-icons/bs";
import { AiOutlineClockCircle } from "react-icons/ai";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { MdRefresh } from "react-icons/md";

interface Question {
  chat_id: number;
  message_id: string | null;
  name: string;
  type: string;
  question: string;
  links?: string[];
  time_stamp: string;
}

const QuestionsPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const authToken = import.meta.env.VITE_AUTH_TOKEN;

  const [listings, setListings] = useState<any[]>([]);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [replyMessage, setReplyMessage] = useState<string>("");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [replyLoading, setReplyLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/get_auto_listings?emp_type=job&account=pv`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            cache: 'no-cache',
          }
        );
        if (!response.ok) throw new Error("Failed to fetch listings");
        const data = await response.json();
        // Only set listings that have questions
        const automatedListings = data.automated || [];
        const listingsWithQuestions = await Promise.all(
          automatedListings.map(async (listing: any) => {
            const hasQuestions = await checkQuestionsExist(listing.listing_number);
            return hasQuestions ? listing : null;
          })
        );
        setListings(listingsWithQuestions.filter(Boolean));
      } catch (err: any) {
        toast.error(err.message);
      }
    };
    fetchListings();
  }, []);

  // Check if listing has questions
  const checkQuestionsExist = async (listingNumber: string) => {
    try {
      const response = await axios.get(`${apiUrl}/getQuestions`, {
        params: { listing: listingNumber },
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return response.data.success && (response.data.questions?.length ?? 0) > 0;
    } catch {
      return false;
    }
  };

  const fetchQuestions = async () => {
    if (!selectedListing) return;
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/getQuestions`, {
        params: { listing: selectedListing },
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
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedListing) {
      fetchQuestions();
    }
  }, [selectedListing]);

  const handleReply = async (chatId: number, messageId: string | null) => {
    if (!replyMessage.trim()) {
      toast.error("Reply message cannot be empty");
      return;
    }

    setReplyLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/reply_question?listing=${selectedListing}`,
        { chat_id: chatId, message_id: messageId, message: replyMessage },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to send reply");
      }

      toast.success("Reply sent successfully");
      setReplyMessage("");
      setSelectedMessageId(null);
      
      // Refresh questions
      const updatedResponse = await axios.get(`${apiUrl}/getQuestions`, {
        params: { listing: selectedListing },
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (updatedResponse.data.success) {
        setQuestions(updatedResponse.data.questions || []);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(errorMessage);
    } finally {
      setReplyLoading(false);
    }
  };

  const filteredQuestions = questions.filter(question => 
    question.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1920px] mx-auto">
        {/* Enhanced Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-800">
                  Questions Dashboard
                </h1>
                {selectedListing && questions.length > 0 && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                    {filteredQuestions.length} Questions
                  </span>
                )}
              </div>
              {selectedListing && (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium text-gray-700">
                    {listings.find(l => l.listing_number === selectedListing)?.listing_name}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500">
                    #{selectedListing}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => fetchQuestions()}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <MdRefresh className="mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-1/5 bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 px-2">Active Listings</h2>
            <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
              {listings.map((listing) => (
                <button
                  key={listing.listing_number}
                  onClick={() => setSelectedListing(listing.listing_number)}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    selectedListing === listing.listing_number
                      ? 'bg-blue-50 border-blue-200 border-2 text-blue-700 shadow-sm'
                      : 'hover:bg-gray-50 border border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <div className="font-medium text-base line-clamp-1">{listing.listing_name}</div>
                  <div className="inline-block text-xs px-2 py-1 mt-2 bg-gray-100 text-gray-600 rounded-md">
                    #{listing.listing_number}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="w-4/5">
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px] bg-white rounded-lg shadow-sm">
                <TailSpin color="#3B82F6" height={80} width={80} />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6">
                    {filteredQuestions.map((q) => (
                      <div 
                        key={q.message_id || q.chat_id} 
                        className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
                      >
                        {/* Header Section */}
                        <div className="px-6 py-4 border-b border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                <span className="text-blue-600 font-medium text-lg">
                                  {q.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">{q.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <AiOutlineClockCircle className="text-gray-400" />
                                  {new Date(q.time_stamp).toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-gray-100 text-xs font-medium text-gray-600 rounded-full">
                                ID: {q.chat_id}
                              </span>
                              <span className="px-3 py-1 bg-blue-50 text-xs font-medium text-blue-600 rounded-full">
                                {q.type}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Question Content */}
                        <div className="p-6">
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                              {q.question}
                            </p>
                          </div>

                          {/* Attachments Section */}
                          {(q.links?.length ?? 0) > 0 && (
                            <div className="mt-4 border-t border-gray-100 pt-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments</h4>
                              <div className="flex flex-wrap gap-3">
                                {q.links?.map((link, idx) => (
                                  /\.(jpg|jpeg|png|gif)$/.test(link) ? (
                                    <div key={idx} className="relative group">
                                      <img
                                        src={link}
                                        alt="Attachment"
                                        className="w-24 h-24 object-cover rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                                        onClick={() => window.open(link, '_blank')}
                                      />
                                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                          View
                                        </span>
                                      </div>
                                    </div>
                                  ) : (
                                    <a
                                      key={idx}
                                      href={link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-sm text-gray-700 rounded-lg border border-gray-200 transition-colors"
                                    >
                                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                      </svg>
                                      Attachment {idx + 1}
                                    </a>
                                  )
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Actions Section */}
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={() => setSelectedMessageId(q.message_id)}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                              <BsReply className="mr-2" /> Reply
                            </button>
                          </div>
                        </div>

                        {/* Reply Section */}
                        {selectedMessageId === q.message_id && (
                          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                            <textarea
                              rows={3}
                              placeholder="Type your reply here..."
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                              className="w-full p-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                            />
                            <div className="flex justify-end mt-3 space-x-3">
                              <button
                                onClick={() => {
                                  setSelectedMessageId(null);
                                  setReplyMessage("");
                                }}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleReply(q.chat_id, q.message_id)}
                                disabled={replyLoading}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                {replyLoading ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Sending...
                                  </>
                                ) : (
                                  'Send Reply'
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default QuestionsPage; 