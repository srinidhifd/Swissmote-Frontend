import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin } from "react-loader-spinner";
import { BsThreeDotsVertical } from "react-icons/bs";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { AutomatedJob, NotAutomatedJob, ClosedAutomatedJob } from "../../types/index";
import {
  setEmpType,
  setAccount,
  setActiveTab,
  setAutomatedListings,
  setNotAutomatedListings,
  setClosedAutomatedListings,
  setCurrentPage,
} from "../../store/slices/autoListingSlice";

const AutoListingsPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const authToken = import.meta.env.VITE_AUTH_TOKEN;

  const dispatch = useDispatch<AppDispatch>();
  const {
    empType,
    account,
    activeTab,
    automatedListings,
    notAutomatedListings,
    closedAutomatedListings,
    currentPage,
  } = useSelector((state: RootState) => state.autoListing);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [source, setSource] = useState<string>("");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postURL, setPostURL] = useState("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("listing_name");
  const [selectedListing, setSelectedListing] = useState<AutomatedJob | NotAutomatedJob | ClosedAutomatedJob | null>(null);
  const [isAutomateModalOpen, setIsAutomateModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewLink, setReviewLink] = useState("");
  const [selectedListingNumber, setSelectedListingNumber] = useState<number | null>(null);

  const [automateForm, setAutomateForm] = useState({
    listing: null as string | null,
    listing_name: "",
    name: "",
    process: "assignment",
    post_over: "normal",
    assignment_link: "",
    designation: "",
    emp_type: empType, // from dropdown
    account: account,  // from dropdown
    ctc: "",
    active_status: true,
  });

  const navigate = useNavigate();

  const handleEmpTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setEmpType(e.target.value));
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setAccount(e.target.value));
  };

  const handleActiveTabChange = (tab: "automated" | "not_automated" | "closed_automated") => {
    dispatch(setActiveTab(tab));
    dispatch(setCurrentPage(1));
    setSearchQuery("");
  };

  const fetchListings = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${apiUrl}/get_auto_listings?emp_type=${empType}&account=${account}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch listings. Please try again.");

      const fetchedData: {
        automated: AutomatedJob[];
        not_automated: NotAutomatedJob[];
        cl_automated: ClosedAutomatedJob;
      } = await response.json();

      dispatch(setAutomatedListings(fetchedData.automated || []));
      dispatch(setNotAutomatedListings(fetchedData.not_automated || []));
      dispatch(
        setClosedAutomatedListings(
          fetchedData.cl_automated ? [fetchedData.cl_automated] : []
        )
      );
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetAssignment = (listing: any) => {
    setSelectedListing(listing);
    setIsSourceModalOpen(true);
  };

  const confirmGetAssignment = () => {
    if (!selectedListing) {
      toast.error("No listing selected.");
      return;
    }
    if (!source) {
      toast.error("Please select a valid source.");
      return;
    }
    navigate("/dashboard/assignments/get", {
      state: {
        listingNumber: selectedListing.listing_number,
        source,
        org: account,
      },
    });
    setIsSourceModalOpen(false);
    setSource("");
  };

  const handlePostAssignment = (listing: any) => {
    setSelectedListing(listing);
    setIsPostModalOpen(true);
  };

  const confirmPostAssignment = async () => {
    if (!selectedListing) {
      toast.error("No listing selected.");
      return;
    }
    if (!postURL.trim()) {
      toast.error("Please enter a valid URL.");
      return;
    }

    const payload = {
      listing: selectedListing.listing_number,
      link: [postURL],
    };

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/add_assignment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to post assignment. Please try again.");
      }

      toast.success("Assignment posted successfully!");
      setIsPostModalOpen(false);
      setPostURL("");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetQuestions = (listing: any) => {
    navigate("/dashboard/questions/get", {
      state: { listingNumber: listing.listing_number },
    });
  };
  const handleOpenAutomateModal = (listing: NotAutomatedJob) => {
    setAutomateForm({
      listing: listing.listing_number,
      listing_name: listing.listing_name || "",
      name: "",
      process: "assignment",
      post_over: "normal",
      assignment_link: "",
      designation: "",
      emp_type: empType, // fetched from dropdown
      account: account,  // fetched from dropdown
      ctc: "",
      active_status: true,
    });
    setIsAutomateModalOpen(true);
  };

  // Handle Make Announcement
  const handleMakeAnnouncement = async () => {
    if (!selectedListingNumber || !announcementMessage.trim()) {
      toast.error("Please provide all details.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/announcement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          listing: selectedListingNumber,
          message: announcementMessage,
        }),
      });

      if (!response.ok) throw new Error("Failed to make announcement.");
      const result = await response.json();
      toast.success(result.message || "Announcement made successfully.");
      setIsAnnouncementModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Review
  const handleAddReview = async () => {
    if (!selectedListingNumber || !reviewLink.trim()) {
      toast.error("Please provide all details.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/add_review`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          listing: selectedListingNumber,
          link: [reviewLink],
        }),
      });

      if (!response.ok) throw new Error("Failed to add review.");
      const result = await response.json();
      toast.success(result.message || "Review added successfully.");
      setIsReviewModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".dropdown")) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const filterListings = (): (AutomatedJob | NotAutomatedJob | ClosedAutomatedJob)[] => {
    let listings: (AutomatedJob | NotAutomatedJob | ClosedAutomatedJob)[] = [];
    if (activeTab === "automated") listings = automatedListings;
    else if (activeTab === "not_automated") listings = notAutomatedListings;
    else if (activeTab === "closed_automated") listings = closedAutomatedListings;


    return listings.filter((item) => {
      if (filterType === "listing_name" && "listing_name" in item) {
        return item.listing_name?.toLowerCase().includes(searchQuery.toLowerCase());
      }
      if (filterType === "project_name") {
        return (item as AutomatedJob | ClosedAutomatedJob).projectname?.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return false;
    });
  };
  const handleAutomateListing = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/automateListing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(automateForm),
      });

      if (!response.ok) {
        throw new Error("Failed to automate listing. Please try again.");
      }

      const result = await response.json();

      if (result.success) {
        toast.success(`Successfully automated listing ${result.Listing_num}`);
        setIsAutomateModalOpen(false);
      } else {
        throw new Error(result.message || "Unknown error occurred.");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };


  const renderTableRows = () => {
    const listings: (AutomatedJob | NotAutomatedJob | ClosedAutomatedJob)[] = filterListings();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = listings.slice(startIndex, startIndex + itemsPerPage);

    if (paginatedData.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="text-center py-4 text-gray-500">
            No listings found.
          </td>
        </tr>
      );
    }

    return paginatedData.map((item: (AutomatedJob | NotAutomatedJob | ClosedAutomatedJob), index: number) => (
      <tr key={index} className="hover:bg-gray-100 transition border-b border-gray-300">
        <td className="px-4 py-2">{"listing_name" in item ? item.listing_name || "N/A" : "N/A"}</td>
        {activeTab === "not_automated" && (
          <td className="px-4 py-2">{item.listing_number}</td>
        )}
        {activeTab === "automated" && (
          <>
            <td className="px-4 py-2">{"projectname" in item ? item.projectname || "N/A" : "N/A"}</td>
            <td className="px-4 py-2">{"date" in item ? dayjs(item.date).format("DD MMMM YYYY") : "N/A"}</td>
            <td className="px-4 py-2">{"conversion_rate" in item ? item.conversion_rate || "N/A" : "N/A"}</td>
            <td className="px-4 py-2 max-w-[150px] truncate text-blue-600">
              {"assignment_link" in item && item.assignment_link ? (
                item.assignment_link.map((link: string, idx: number) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm hover:underline"
                  >
                    {link.length > 20 ? `${link.substring(0, 20)}...` : link}
                  </a>
                ))
              ) : (
                "N/A"
              )}
            </td>
          </>
        )}
        <td className="px-4 py-2 text-center dropdown relative">
          {activeTab === "automated" && (
            <>
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={() =>
                  dropdownOpen === item.listing_number
                    ? setDropdownOpen(null)
                    : setDropdownOpen(item.listing_number || null)
                }
              >
                <BsThreeDotsVertical />
              </button>
              {dropdownOpen === item.listing_number && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
                  <button
                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                    onClick={() => handleGetAssignment(item)}
                  >
                    Get Assignment
                  </button>
                  <button
                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                    onClick={() => handlePostAssignment(item)}
                  >
                    Post Assignment
                  </button>
                  <button
                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                    onClick={() => handleGetQuestions(item)}
                  >
                    Get Questions
                  </button>
                  <button
                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setSelectedListingNumber(parseInt(item.listing_number, 10));
                      setIsAnnouncementModalOpen(true);
                    }}
                  >
                    Make Announcement
                  </button>
                  <button
                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setSelectedListingNumber(parseInt(item.listing_number, 10));
                      setIsReviewModalOpen(true);
                    }}
                  >
                    Add Review
                  </button>
                </div>
              )}
            </>
          )}
          {activeTab === "not_automated" && (
            <button
              onClick={() => handleOpenAutomateModal(item as NotAutomatedJob)}
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Automate
            </button>
          )}
        </td>
      </tr>
    ));
  };

  const renderPagination = (totalItems: number) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages === 0) return null;

    return (
      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-600">
          Showing {currentPage} of {totalPages} pages
        </p>
        <div className="flex items-center space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => dispatch(setCurrentPage(currentPage - 1))}
            className={`px-3 py-1 ${currentPage === 1
              ? "bg-gray-300 text-gray-500"
              : "bg-blue-500 text-white hover:bg-blue-600"
              } rounded`}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => dispatch(setCurrentPage(index + 1))}
              className={`px-3 py-1 ${currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-500"
                } rounded`}
            >
              {index + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => dispatch(setCurrentPage(currentPage + 1))}
            className={`px-3 py-1 ${currentPage === totalPages
              ? "bg-gray-300 text-gray-500"
              : "bg-blue-500 text-white hover:bg-blue-600"
              } rounded`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const renderTable = () => {
    if (loading) return <p className="text-gray-500">Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    if (activeTab === "automated" && automatedListings.length > 0) {
      return (
        <div>
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Listing Name</th>
                <th className="px-4 py-2 text-left">Project Name</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Conversion Rate</th>
                <th className="px-4 py-2 text-left">Assignment Links</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>{renderTableRows()}</tbody>
          </table>
          {renderPagination(automatedListings.length)}
        </div>
      );
    }

    if (activeTab === "not_automated" && notAutomatedListings.length > 0) {
      return (
        <div>
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Listing Name</th>
                <th className="px-4 py-2 text-left">Listing Number</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>{renderTableRows()}</tbody>
          </table>
          {renderPagination(notAutomatedListings.length)}
        </div>
      );
    }

    if (activeTab === "closed_automated" && closedAutomatedListings.length > 0) {
      return (
        <div>
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Listing Number</th>
                <th className="px-4 py-2 text-left">Project Name</th>
                <th className="px-4 py-2 text-left">Posted Date</th>
                <th className="px-4 py-2 text-left">Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              {closedAutomatedListings.map((item: ClosedAutomatedJob, index: number) => (
                <tr key={index} className="hover:bg-gray-100 transition border-b border-gray-300">
                  <td className="px-4 py-2">{item.listing_number}</td>
                  <td className="px-4 py-2">{item.projectname || "N/A"}</td>
                  <td className="px-4 py-2">{dayjs(item.date).format("D MMMM YYYY")}</td>
                  <td className="px-4 py-2">{item.conversion_rate || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }


    return <p className="text-gray-500">No data available.</p>;
  };


  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <TailSpin height="80" width="80" color="#4fa94d" ariaLabel="loading" />
        </div>
      )}
      <ToastContainer />

      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">Auto Listings</h1>
          </div>
          <div className="flex space-x-4 mb-6">
            <input
              type="text"
              placeholder="Type to Start Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-3 border border-gray-300 rounded w-[50%]"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-3 border border-gray-300 rounded"
            >
              <option value="listing_name">Listing Name</option>
              <option value="project_name">Project Name</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Employment Type</label>
            <select
              value={empType}
              onChange={handleEmpTypeChange}
              className="w-full p-3 border border-gray-300 rounded"
            >
              <option value="internship">Internship</option>
              <option value="job">Job</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Account</label>
            <select
              value={account}
              onChange={handleAccountChange}
              className="w-full p-3 border border-gray-300 rounded"
            >
              <option value="pv">PV</option>
              <option value="sa">SA</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchListings}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded"
            >
              Fetch Listings
            </button>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => handleActiveTabChange("automated")}
            className={`px-4 py-2 rounded ${activeTab === "automated" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
          >
            Automated Listings
          </button>
          <button
            onClick={() => handleActiveTabChange("not_automated")}
            className={`px-4 py-2 rounded ${activeTab === "not_automated" ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
          >
            Not Automated Listings
          </button>
          <button
            onClick={() => handleActiveTabChange("closed_automated")}
            className={`px-4 py-2 rounded ${activeTab === "closed_automated" ? "bg-red-600 text-white" : "bg-gray-200"
              }`}
          >
            Closed Listings
          </button>
        </div>

        {renderTable()}
      </div>
      {/* Source Selection Modal */}
      {isSourceModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-96">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setIsSourceModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Source</h2>
            <label
              htmlFor="source"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Source
            </label>
            <select
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Source</option>
              <option value="itn">Internshala</option>
              <option value="db">Database</option>
            </select>
            <div className="flex justify-end mt-6 space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400 transition"
                onClick={() => setIsSourceModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 font-semibold rounded-md ${source
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
                onClick={confirmGetAssignment}
                disabled={!source}
              >
                Get Assignment
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Make Announcement Modal */}
      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Make Announcement</h2>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={announcementMessage}
              onChange={(e) => setAnnouncementMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded mb-4"
              rows={4}
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsAnnouncementModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleMakeAnnouncement}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Add Review</h2>
            <label className="block text-sm font-medium text-gray-700 mb-2">Review Link</label>
            <input
              type="text"
              value={reviewLink}
              onChange={(e) => setReviewLink(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReview}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Post Assignment Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add Assignment URL</h2>
            <input
              type="text"
              value={postURL}
              onChange={(e) => setPostURL(e.target.value)}
              placeholder="Enter assignment URL"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                onClick={() => setIsPostModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={confirmPostAssignment}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {isAutomateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Automate Listing</h2>

            {/* Project Name */}
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
            <input
              type="text"
              value={automateForm.name}
              onChange={(e) =>
                setAutomateForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded mb-4"
            />

            {/* Process */}
            <label className="block text-sm font-medium text-gray-700 mb-2">Process</label>
            <select
              value={automateForm.process}
              onChange={(e) =>
                setAutomateForm((prev) => ({
                  ...prev,
                  process: e.target.value,
                  designation: e.target.value === "assignment" ? "intern" : "",
                }))
              }
              className="w-full p-3 border border-gray-300 rounded mb-4"
            >
              <option value="assignment">Assignment</option>
              <option value="offer">Offer</option>
            </select>

            {/* Assignment Link */}
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment Link
            </label>
            <input
              type="text"
              value={automateForm.assignment_link}
              onChange={(e) =>
                setAutomateForm((prev) => ({
                  ...prev,
                  assignment_link: e.target.value,
                }))
              }
              className="w-full p-3 border border-gray-300 rounded mb-4"
            />

            {/* Post Over */}
            <label className="block text-sm font-medium text-gray-700 mb-2">Post Over</label>
            <select
              value={automateForm.post_over}
              onChange={(e) =>
                setAutomateForm((prev) => ({ ...prev, post_over: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded mb-4"
            >
              <option value="normal">Normal</option>
              <option value="startupathon">Startupathon</option>
            </select>

            {/* CTC */}
            <label className="block text-sm font-medium text-gray-700 mb-2">CTC</label>
            <input
              type="text"
              value={automateForm.ctc}
              onChange={(e) =>
                setAutomateForm((prev) => ({ ...prev, ctc: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded mb-4"
            />

            {/* Designation (only for "offer" process) */}
            {automateForm.process === "offer" && (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Designation
                </label>
                <input
                  type="text"
                  value={automateForm.designation}
                  onChange={(e) =>
                    setAutomateForm((prev) => ({
                      ...prev,
                      designation: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded mb-4"
                />
              </>
            )}

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsAutomateModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAutomateListing}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Automate Listing
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AutoListingsPage;
