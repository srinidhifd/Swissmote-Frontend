import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { FaRegCheckCircle, FaRegTimesCircle, FaRegEnvelope, FaRegEdit, FaCopy, FaRegBookmark, FaRegBuilding } from "react-icons/fa";
import { MdDownload, MdOutlineChatBubbleOutline, MdOutlineWhereToVote, } from "react-icons/md";
import { AiOutlineFileText } from "react-icons/ai";
import { HiOutlineBriefcase } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsDatabase } from "react-icons/bs";

const GetAssignmentsPage: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const authToken = import.meta.env.VITE_AUTH_TOKEN;

  const location = useLocation();
  const { listingNumber, listingName, projectName, source, org } = location.state || {};

  const [rowData] = useState<number>(10);
  const [offsetData, setOffsetData] = useState<number>(0);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>("all");
  const [loadingMark, setLoadingMark] = useState<number | null>(null);
  const [hireLoading, setHireLoading] = useState<number | null>(null);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (listingNumber && source) {
      handleFetchAssignments();
    } else {
      setError("Missing listingNumber or source in navigation state.");
    }
  }, [listingNumber, source, org, offsetData]);

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
          org,
          row_data: rowData,
          offset_data: offsetData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch assignments. Please try again.");
      }

      const data = await response.json();

      if (data.success && data.data) {
        const parsedAssignments = Object.entries(data.data).map(([key, value]) => ({
          ...(value as Record<string, any>), // Cast value as an object
          candidate_id: parseInt(key, 10),
        }));

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

  const handleNavigateToChat = (listing: string, candidateId: string, candidateName: string, projectName: string) => {
    navigate("/dashboard/chat", {
      state: {
        listing, candidateId, userName: candidateName, projectName, listingName
      },
    });
  }

  const handleMarkAsEvaluated = async (applicantId: number) => {
    setLoadingMark(applicantId);

    try {
      const response = await fetch(
        `${apiUrl}/mark_eval_internshala?applicant_id=${applicantId}&listing=${listingNumber}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark as evaluated.");
      }

      const result = await response.json();

      if (result.success) {
        toast.success("Marked as Evaluated successfully!");
        setAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment.candidate_id === applicantId
              ? { ...assignment, evaluated: true }
              : assignment
          )
        );
      } else {
        throw new Error(result.message || "Unknown error occurred.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to mark as evaluated.");
    } finally {
      setLoadingMark(null);
    }
  };

  const handleMarkForFuture = async (applicantId: number) => {
    setLoadingMark(applicantId);

    try {
      const response = await fetch(
        `${apiUrl}/mark_future_internshala?applicant_id=${applicantId}&listing=${listingNumber}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark for future consideration.");
      }

      const result = await response.json();

      if (result.success) {
        toast.success("Marked for Future Consideration successfully!");
        setAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment.candidate_id === applicantId
              ? { ...assignment, future_consideration: true }
              : assignment
          )
        );
      } else {
        throw new Error(result.message || "Unknown error occurred.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to mark for future consideration.");
    } finally {
      setLoadingMark(null);
    }
  };

  const handleGetCandidateEmail = async (candidateId: number) => {
    console.log("Candidate ID:", candidateId);
    try {
      const response = await fetch(
        `${apiUrl}/candidate_email?applicant_id=${candidateId}&org=${org}`,
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
        console.log("Email fetched:", data.email_id);
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
  const handleCopyToClipboard = () => {
    if (email) {
      navigator.clipboard.writeText(email);
      toast.success("Email copied to clipboard!");
    }
  };
  const handleReplyToCandidate = async () => {
    if (!selectedCandidateId || !replyMessage) return;

    try {
      const response = await fetch(
        `${apiUrl}/reply_candidate?listing_num=${listingNumber}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            candidate_id: selectedCandidateId,
            message: replyMessage,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send reply to candidate.");
      }

      const result = await response.json();

      if (result.success) {
        toast.success("Message sent successfully!");
        setReplyModalOpen(false);
        setReplyMessage("");
      } else {
        throw new Error(result.message || "Unknown error occurred.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to send reply.");
    }
  };

  const handleHireCandidate = async (applicantId: number) => {
    setHireLoading(applicantId);
    try {
      const response = await fetch(`${apiUrl}/hire_candidate?listing=${listingNumber}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          applicants: [String(applicantId)],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to hire the candidate.");
      }

      const result = await response.json();

      if (result.success) {
        toast.success("Candidate hired successfully!");
      } else {
        throw new Error(result.message || "Unknown error occurred.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to hire the candidate.");
    } finally {
      setHireLoading(null);
    }
  };

  const renderAttachments = (attachments: any[]) => {
    const allowedExtensions = [".pdf", ".png", ".jpg", ".jpeg", ".mp4", ".docx", ".zip", ".docx", ".doc"]; // Add other formats if needed

    return attachments.map((attachment: any, index: number) => {
      const fileExtension = attachment[2]?.match(/\.[0-9a-z]+$/i); // Extract file extension
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


  const filteredAssignments = assignments.filter((assignment) => {
    if (filter === "evaluated") return assignment.evaluated;
    if (filter === "future") return assignment.future_consideration;
    return true;
  });

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <ToastContainer />
      <div className="max-w-8xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="mb-6 p-6 bg-white shadow-subtle rounded-lg">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Assignments Dashboard</h1>
              <p className="text-sm text-gray-600 mt-2">
                Manage assignments, view submissions, and communicate with candidates.
              </p>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            {/* Project Name Card */}
            <div className="p-5 bg-gray-50 rounded-lg shadow-md border border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Project Name
              </p>
              <h2 className="text-lg font-semibold text-gray-800 mt-2">
                {projectName || "N/A"}
              </h2>
            </div>

            {/* Listing Name Card */}
            <div className="p-5 bg-indigo-50 rounded-lg shadow-md border border-indigo-200">
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                Listing Name
              </p>
              <h2 className="text-lg font-semibold text-gray-800 mt-2">
                {listingName || "N/A"}
              </h2>
            </div>

            {/* Listing Number Card */}
            <div className="p-5 bg-teal-50 rounded-lg shadow-md border border-teal-200">
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide">
                Listing Number
              </p>
              <h2 className="text-lg font-semibold text-gray-800 mt-2">
                {listingNumber || "N/A"}
              </h2>
            </div>
          </div>

        </div>



        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredAssignments.length} of {totalRecords} records
          </p>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="all">All</option>
            <option value="evaluated">Evaluated</option>
            <option value="future">Future Consideration</option>
          </select>
        </div>

        {loading && (
          <div className="flex justify-center items-center ">
            <TailSpin height="80" width="80" color="#4fa94d" ariaLabel="loading" />
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}

        <div>
          {filteredAssignments.length > 0 ? (
            <div className="space-y-6">
              {filteredAssignments.map((assignment, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md rounded-md p-4 border border-gray-300"
                >
                  {/* Header Section */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {assignment.name || "Unnamed Candidate"}
                    </h2>
                    <p className="text-sm text-gray-500 flex items-center">
                      <AiOutlineFileText className="inline text-gray-500 mr-2" />
                      Received On: {assignment.recieved_on || "N/A"}
                    </p>
                  </div>

                  {/* Details Section */}
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                    <p className="flex items-center">
                      <BsDatabase className="text-gray-500 mr-2" />
                      <span>
                        <strong>From:</strong> {assignment.from || "Unknown Source"}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <FaRegBuilding className="text-gray-500 mr-2" />
                      <span>
                        <strong>Location:</strong> {assignment.location || "Not Specified"}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <HiOutlineBriefcase className="text-gray-500 mr-2" />
                      <span>
                        <strong>Experience:</strong>{" "}
                        {assignment.job_expreince || "No Experience Listed"}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <MdOutlineWhereToVote className="text-gray-500 mr-2" />
                      <span>
                        <strong>Relocation:</strong>{" "}
                        {assignment.relocation ? "Yes" : "No"}
                      </span>
                    </p>
                  </div>

                  {/* Attachments Section */}
                  <div className="mb-4">
                    <strong className="text-gray-700">Attachments:</strong>
                    <div className="mt-2 space-y-2 break-all text-sm">
                      {assignment.assignment?.length > 0 ? (
                        renderAttachments(assignment.assignment)
                      ) : (
                        <p className="text-gray-500">No attachments</p>
                      )}
                    </div>
                  </div>

                  <hr className="my-4" />

                  {/* Buttons Section */}
                  <div className="flex justify-around items-center">
                    <button
                      onClick={() =>
                        handleMarkAsEvaluated(assignment.candidate_id)
                      }
                      disabled={
                        assignment.evaluated || loadingMark === assignment.candidate_id
                      }
                      className={`px-4 py-2 text-sm flex items-center rounded ${assignment.evaluated
                        ? "bg-green-100 text-green-700 cursor-not-allowed"
                        : "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                        }`}
                    >
                      {assignment.evaluated ? (
                        <>
                          <FaRegCheckCircle className="mr-2" />
                          Evaluated
                        </>
                      ) : (
                        <>
                          <FaRegTimesCircle className="mr-2" />
                          Mark as Evaluated
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleMarkForFuture(assignment.candidate_id)}
                      disabled={
                        assignment.future_consideration ||
                        loadingMark === assignment.candidate_id
                      }
                      className={`px-4 py-2 text-sm flex items-center rounded ${assignment.future_consideration
                        ? "bg-blue-100 text-blue-700 cursor-not-allowed"
                        : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
                        }`}
                    >
                      <FaRegBookmark className="mr-2" />
                      {assignment.future_consideration
                        ? "Future Consideration"
                        : "Mark for Future"}
                    </button>
                    <button
                      onClick={() =>
                        handleNavigateToChat(
                          listingNumber,
                          assignment.candidate_id,
                          assignment.name,
                          assignment.project
                        )
                      }
                      className="px-4 py-2 text-sm flex items-center rounded bg-orange-100 hover:bg-orange-200 text-orange-700"
                    >
                      <MdOutlineChatBubbleOutline className="mr-2" />
                      Chat
                    </button>
                    <button
                      onClick={() =>
                        handleGetCandidateEmail(assignment.candidate_id)
                      }
                      className="px-4 py-2 text-sm flex items-center rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                    >
                      <FaRegEnvelope className="mr-2" />
                      Get Email
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCandidateId(assignment.candidate_id);
                        setReplyModalOpen(true);
                      }}
                      className="px-4 py-2 text-sm flex items-center rounded bg-purple-100 hover:bg-purple-200 text-purple-700"
                    >
                      <FaRegEdit className="mr-2" />
                      Reply
                    </button>
                    <button
                      onClick={() => handleHireCandidate(assignment.candidate_id)}
                      disabled={hireLoading === assignment.candidate_id}
                      className={`px-4 py-2 text-sm flex items-center rounded ${hireLoading === assignment.candidate_id
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-teal-100 hover:bg-teal-200 text-teal-700"
                        }`}
                    >
                      <FaRegCheckCircle className="mr-2" />
                      Hire
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !loading && (
              <p className="text-center text-gray-500">No assignments found.</p>
            )
          )}
        </div>



        {filteredAssignments.length > 0 && (
          <div className="flex justify-between items-center mt-6">
            <p className="text-gray-600">
              Showing {currentPage} of {Math.ceil(totalRecords / rowData)} pages
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300 text-gray-500" : "bg-blue-500 text-white"
                  }`}
              >
                Previous
              </button>
              {[...Array(Math.ceil(totalRecords / rowData))].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded ${currentPage === index + 1
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
                className={`px-4 py-2 rounded ${currentPage === Math.ceil(totalRecords / rowData)
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

      {replyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Reply to Candidate</h2>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Enter your message"
              className="w-full p-3 border border-gray-300 rounded mb-4"
              rows={4}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setReplyModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleReplyToCandidate}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white border-2 border-blue-500 p-6 rounded-lg shadow-lg w-96">
            {/* Close Icon */}
            <button
              onClick={() => setEmailModalOpen(false)}
              className="absolute top-2 right-2 text-red-600 text-xl font-bold hover:text-red-800"
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center text-blue-600">
              Candidate Email
            </h2>
            {email ? (
              <>
                <p className="text-gray-800 mb-6 text-center bg-gray-100 border border-blue-300 p-2 rounded-lg ">
                  {email}
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleCopyToClipboard}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600"
                  >
                    <FaCopy className="mr-2" /> Copy Email
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center">No email available.</p>
            )}
          </div>
        </div>
      )}


    </div>
  );
};

export default GetAssignmentsPage;
