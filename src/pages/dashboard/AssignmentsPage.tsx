import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin } from "react-loader-spinner";
import { FaRegCheckCircle, FaRegEnvelope, FaRegBookmark, FaSearch, FaRegFolder  } from "react-icons/fa";
import { MdOutlineChatBubbleOutline, MdRefresh, MdDownload } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AiOutlineFileText } from "react-icons/ai";
import Pagination from "../../components/Pagination";
import { BsCheckCircle } from 'react-icons/bs';

interface Assignment {
  candidate_id: number;
  name: string;
  email: string;
  status: string;
  evaluated: boolean;
  future_consideration: boolean;
  [key: string]: any;
}

interface ListingInfo {
  listing_number: string;
  listing_name?: string;
  project_name?: string;
}

const AssignmentsPage = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const authToken = import.meta.env.VITE_AUTH_TOKEN;

  const [listingNumbers, setListingNumbers] = useState<string[]>([]);
  const [assignmentsData, setAssignmentsData] = useState<{ [key: string]: Assignment[] }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add new states for filtering and search
  const [searchTerm, setSearchTerm] = useState("");

  const [loadingMark, setLoadingMark] = useState<number | null>(null);

  const [listings, setListings] = useState<ListingInfo[]>([]);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);

  // Add these additional states
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Add new state for filter
  const [filterType, setFilterType] = useState<'all' | 'evaluated' | 'future'>('all');

  useEffect(() => {
    fetchAutoListings();
  }, []);

  useEffect(() => {
    if (listingNumbers.length > 0) {
      fetchAllAssignments();
    }
  }, [listingNumbers]);

  const fetchAutoListings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/get_auto_listings?emp_type=job&account=pv`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        }
      });

      if (!response.ok) throw new Error("Failed to fetch auto listings");

      const data = await response.json();
      const listingsInfo: ListingInfo[] = [];
      
      // Only include automated listings
      if (data.automated && Array.isArray(data.automated)) {
        listingsInfo.push(...data.automated.map((listing: any) => ({
          listing_number: listing.listing_number,
          listing_name: listing.listing_name || 'N/A',
          project_name: listing.projectname || listing.project_name || 'N/A'
        })));
      }

      setListings(listingsInfo);
      setListingNumbers(listingsInfo.map(l => l.listing_number));
      if (listingsInfo.length > 0) {
        setSelectedListing(listingsInfo[0].listing_number);
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllAssignments = async () => {
    setLoading(true);
    const assignmentsPromises = listingNumbers.map(listing => 
      fetch(`${apiUrl}/get_assignments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          listing,
          source: "itn",
          row_data: 10,
          offset_data: 0
        })
      })
    );

    try {
      const responses = await Promise.all(assignmentsPromises);
      const data = await Promise.all(responses.map(r => r.json()));
      
      const assignmentsByListing: { [key: string]: Assignment[] } = {};
      
      listingNumbers.forEach((listing, index) => {
        if (data[index].success && data[index].data) {
          const assignments = Object.entries(data[index].data).map(([key, value]) => ({
            candidate_id: parseInt(key, 10),
            name: (value as any).name || 'N/A',
            email: (value as any).email || 'N/A',
            status: (value as any).status || 'N/A',
            evaluated: Boolean((value as any).evaluated),
            future_consideration: Boolean((value as any).future_consideration),
            ...(value as Record<string, any>)
          }));
          assignmentsByListing[listing] = assignments;
        }
      });

      setAssignmentsData(assignmentsByListing);
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterAssignments = (assignments: Assignment[] | undefined) => {
    if (!assignments) return [];
    
    return assignments.filter(assignment => {
      const matchesSearch = !searchTerm || 
        assignment.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        filterType === 'all' ||
        (filterType === 'evaluated' && assignment.evaluated) ||
        (filterType === 'future' && assignment.future_consideration);
      
      return matchesSearch && matchesFilter;
    });
  };

  const handleNavigateToChat = (listing: string, candidateId: string, candidateName: string) => {
    navigate("/dashboard/chat", {
      state: {
        listing,
        candidateId,
        userName: candidateName,
        projectName: "Project",
      },
    });
  };

  const handleMarkAsEvaluated = async (listing: string, applicantId: number) => {
    setLoadingMark(applicantId);
    try {
      const response = await fetch(
        `${apiUrl}/mark_eval_internshala?applicant_id=${applicantId}&listing=${listing}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (!response.ok) throw new Error("Failed to mark as evaluated.");
      const result = await response.json();

      if (result.success) {
        toast.success("Marked as Evaluated successfully!");
        // Update local state
        setAssignmentsData(prev => ({
          ...prev,
          [listing]: prev[listing].map(assignment =>
            assignment.candidate_id === applicantId
              ? { ...assignment, evaluated: true }
              : assignment
          )
        }));
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to mark as evaluated.");
    } finally {
      setLoadingMark(null);
    }
  };


  const handleReply = async () => {
    if (!selectedCandidateId || !replyMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/reply_internshala`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          applicant_id: selectedCandidateId,
          message: replyMessage,
        }),
      });

      if (!response.ok) throw new Error("Failed to send reply");
      const result = await response.json();

      if (result.success) {
        toast.success("Reply sent successfully!");
        setReplyModalOpen(false);
        setReplyMessage("");
        setSelectedCandidateId(null);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to send reply");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleGetCandidateEmail = async (candidateId: number) => {
    try {
      const response = await fetch(
        `${apiUrl}/candidate_email?applicant_id=${candidateId}&org=pv`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch candidate email.");
      }

      const data = await response.json();

      if (data.success) {
        setEmail(data.email_id);
        setEmailModalOpen(true);
        toast.success("Email fetched successfully!");
      } else {
        throw new Error(data.message || "Failed to fetch email.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch candidate email.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Email copied to clipboard!'))
      .catch(() => toast.error('Failed to copy email'));
  };

  const renderListingCard = (listing: ListingInfo) => (
    <button
      key={listing.listing_number}
      onClick={() => setSelectedListing(listing.listing_number)}
      className={`w-full p-4 rounded-lg text-left transition-all ${
        selectedListing === listing.listing_number
          ? 'bg-blue-50 border-blue-200 border-2 text-blue-700 shadow-sm'
          : 'hover:bg-gray-50 border border-gray-200 hover:border-blue-200'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="font-medium text-base line-clamp-1">{listing.project_name}</div>
        {assignmentsData[listing.listing_number] && (
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
            {assignmentsData[listing.listing_number].length}
          </span>
        )}
      </div>
      <div className="text-sm text-gray-600 mb-2 line-clamp-1">{listing.listing_name}</div>
      <div className="inline-block text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
        #{listing.listing_number}
      </div>
    </button>
  );

  const renderAttachments = (attachments: any[]) => {
    const allowedExtensions = [".pdf", ".png", ".jpg", ".jpeg", ".mp4", ".docx", ".zip", ".doc"];

    return attachments.map((attachment: any, index: number) => {
      const fileExtension = attachment[2]?.match(/\.[0-9a-z]+$/i);
      const isValidExtension = fileExtension && allowedExtensions.includes(fileExtension[0]);

      return (
        <div key={index} className="flex items-center space-x-2">
          <a
            href={attachment[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {attachment[1]}
          </a>
          {isValidExtension && (
            <MdDownload className="text-blue-700 hover:text-blue-800 cursor-pointer" />
          )}
        </div>
      );
    });
  };

  const renderAssignmentCard = (assignment: Assignment, listing: string) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all">
      {/* Header with name and date */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-medium text-lg text-gray-800">{assignment.name}</h3>
        <div className="flex space-x-2">
          {assignment.evaluated && (
            <FaRegCheckCircle className="text-green-500 text-lg" title="Evaluated" />
          )}
          {assignment.future_consideration && (
            <FaRegBookmark className="text-blue-500 text-lg" title="Future Consideration" />
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2">
          <MdOutlineChatBubbleOutline className="text-gray-400" />
          <span className="text-sm">{assignment.from}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div>
            <span className="text-gray-500">Location:</span> {assignment.location}
          </div>
          <div>
            <span className="text-gray-500">Received:</span> {assignment.recieved_on}
          </div>
          <div>
            <span className="text-gray-500">Experience:</span> {assignment.job_expreince}
          </div>
          <div>
            <span className="text-gray-500">Relocation:</span> {assignment.relocation ? 'Yes' : 'No'}
          </div>
        </div>

        {/* Attachments Section */}
        {assignment.assignment && assignment.assignment.length > 0 && (
          <div className="mt-4 border-t pt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
            <div className="space-y-2 text-sm">
              {renderAttachments(assignment.assignment)}
            </div>
          </div>
        )}
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        <button
          onClick={() => handleNavigateToChat(listing, assignment.candidate_id.toString(), assignment.name)}
          className="flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <MdOutlineChatBubbleOutline className="mr-2" />
          Chat
        </button>

        <button
          onClick={() => handleMarkAsEvaluated(listing, assignment.candidate_id)}
          disabled={loadingMark === assignment.candidate_id || assignment.evaluated}
          className={`flex items-center justify-center px-3 py-2 text-sm rounded-lg transition-colors ${
            assignment.evaluated
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-green-50 text-green-600 hover:bg-green-100"
          }`}
        >
          {loadingMark === assignment.candidate_id ? (
            <TailSpin color="#10B981" height={20} width={20} />
          ) : (
            <>
              <BsCheckCircle className="mr-2" />
              {assignment.evaluated ? "Evaluated" : "Evaluate"}
            </>
          )}
        </button>

        

        <button
          onClick={() => {
            setSelectedCandidateId(assignment.candidate_id);
            setReplyModalOpen(true);
          }}
          className="flex items-center justify-center px-3 py-2 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <MdOutlineChatBubbleOutline className="mr-2" />
          Reply
        </button>

        {assignment.assignment_link && (
          <a
            href={assignment.assignment_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-3 py-2 text-sm bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <AiOutlineFileText className="mr-2" />
            View Assignment
          </a>
        )}

        <button
          onClick={() => {
            setSelectedCandidateId(assignment.candidate_id);
            handleGetCandidateEmail(assignment.candidate_id);
          }}
          className="flex items-center justify-center px-3 py-2 text-sm bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors"
        >
          <FaRegEnvelope className="mr-2" />
          Email
        </button>
      </div>
    </div>
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
                  Assignments Dashboard
                </h1>
                {selectedListing && assignmentsData[selectedListing] && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                    {filterAssignments(assignmentsData[selectedListing]).length} Assignments
                  </span>
                )}
              </div>
              {selectedListing && (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium text-gray-700">
                    {listings.find(l => l.listing_number === selectedListing)?.project_name}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">
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
              <div className="flex gap-4">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as 'all' | 'evaluated' | 'future')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                >
                  <option value="all">All Assignments</option>
                  <option value="evaluated">Evaluated</option>
                  <option value="future">Future Consideration</option>
                </select>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                onClick={fetchAutoListings}
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
          {/* Sidebar - Make it more compact and polished */}
          <div className="w-1/5 bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 px-2">Active Listings</h2>
            <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
              {listings.map((listing) => renderListingCard(listing))}
            </div>
          </div>

          {/* Main Content - Remove filters section and update layout */}
          <div className="w-4/5">
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px] bg-white rounded-lg shadow-sm">
                <TailSpin color="#3B82F6" height={80} width={80} />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 text-center">
                <p className="font-medium">{error}</p>
                <button
                  onClick={fetchAutoListings}
                  className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : selectedListing && assignmentsData[selectedListing] ? (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterAssignments(assignmentsData[selectedListing])
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((assignment) => renderAssignmentCard(assignment, selectedListing))}
                  </div>
                </div>
                
                {filterAssignments(assignmentsData[selectedListing]).length > itemsPerPage && (
                  <div className="border-t border-gray-100 mt-6 pb-6 pt-4 flex justify-center">
                    <Pagination
                      totalItems={filterAssignments(assignmentsData[selectedListing]).length}
                      itemsPerPage={itemsPerPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-16 text-center">
                <div className="text-gray-400 text-6xl mb-4">
                  <FaRegFolder />
                </div>
                <p className="text-gray-600 text-lg">
                  {loading ? "Loading assignments..." : "Select a listing to view assignments"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {replyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Reply to Candidate</h3>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              className="w-full h-32 p-2 border rounded-lg mb-4"
              placeholder="Enter your reply..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setReplyModalOpen(false);
                  setReplyMessage("");
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleReply}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {emailModalOpen && email && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Candidate Email</h3>
              <button
                onClick={() => setEmailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between gap-2">
                <a 
                  href={`mailto:${email}`}
                  className="text-blue-600 hover:text-blue-700 break-all"
                >
                  {email}
                </a>
                <button
                  onClick={() => copyToClipboard(email)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                  title="Copy to clipboard"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => copyToClipboard(email)}
                className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
              >
                Copy Email
              </button>
              <button
                onClick={() => setEmailModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default AssignmentsPage; 