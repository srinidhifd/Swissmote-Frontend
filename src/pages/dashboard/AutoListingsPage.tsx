import { useState, useEffect, useCallback, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin } from "react-loader-spinner";
import { BsThreeDotsVertical } from "react-icons/bs";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { HandThumbUpIcon } from "@heroicons/react/24/outline"; // As replacement for Handshake
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
import '../../App.css';
import { MdOutlineBusinessCenter } from "react-icons/md";




const AutoListingsPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const authToken = import.meta.env.VITE_AUTH_TOKEN;

  const isFetched = useRef(false); // Added useRef


  const dispatch = useDispatch<AppDispatch>();
  const {
    empType = "job", // Default to "job"
    account = "pv",   // Default to "pv"
    activeTab,
    automatedListings,
    notAutomatedListings,
    closedAutomatedListings,
    currentPage,
  } = useSelector((state: RootState) => state.autoListing);

  const [listingsLoading, setListingsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [isEditFollowupModalOpen, setIsEditFollowupModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postURL, setPostURL] = useState("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("reset");
  const [selectedListing, setSelectedListing] = useState<AutomatedJob | NotAutomatedJob | ClosedAutomatedJob | null>(null);
  const [isAutomateModalOpen, setIsAutomateModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewLink, setReviewLink] = useState("");
  const [selectedListingNumber, setSelectedListingNumber] = useState<number | null>(null);
  const [day2Message, setDay2Message] = useState("");
  const [day4Message, setDay4Message] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [messages, setMessages] = useState({
    intro_message: "",
    assignment_message: "",
    assignment_message_startupathon: "",
  });
  const [selectedRowData, setSelectedRowData] = useState<AutomatedJob | NotAutomatedJob | ClosedAutomatedJob | null>(null);


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
    introMessage: "default",
    introMessageContent: "",
    followup2: "default", // default value for Day 2 follow-up
    followup4: "default", // default value for Day 4 follow-up
    followup2Message: "", // Added property
    followup4Message: "", // Added property
    assignmentMessage: "default",
    assignmentMessageContent: "",
    active_status: true,
  });
  const resetForm = () => {
    setAutomateForm({
      listing: null,
      listing_name: "",
      name: "",
      process: "assignment",
      post_over: "normal",
      assignment_link: "",
      designation: "",
      emp_type: empType,
      account: account,
      ctc: "",
      introMessage: "default",
      introMessageContent: "",
      followup2: "default",
      followup4: "default",
      followup2Message: "",
      followup4Message: "",
      assignmentMessage: "default",
      assignmentMessageContent: "",
      active_status: true,
    });
  };



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

  const [messagesLoading, setMessagesLoading] = useState(true);

  const fetchListings = useCallback(async () => {
    if (!apiUrl || !authToken) return;

    // Check if data already exists for the active tab
    if (
      (activeTab === "automated" && automatedListings.length > 0) ||
      (activeTab === "not_automated" && notAutomatedListings.length > 0) ||
      (activeTab === "closed_automated" && closedAutomatedListings.length > 0)
    ) {
      return;
    }
    // Skip fetching if data is already available

    setListingsLoading(true);

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
          cache: 'no-cache',
        }
      );

      if (!response.ok) throw new Error("Failed to fetch listings");

      const fetchedData = await response.json();

      dispatch((dispatch) => {
        dispatch(setAutomatedListings(fetchedData.automated || []));
        dispatch(setNotAutomatedListings(fetchedData.not_automated || []));
        dispatch(setClosedAutomatedListings(fetchedData.cl_automated ? [fetchedData.cl_automated] : []));
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setListingsLoading(false);
    }
  }, [apiUrl, authToken, empType, account, activeTab, automatedListings, notAutomatedListings, closedAutomatedListings]);


  const fetchMessages = useCallback(async () => {
    setMessagesLoading(true);
    try {
      const endpoints = [
        'invite_message',
        'assignment_message',
        'assignment_message_startupathon'
      ].map(msg =>
        fetch(`${apiUrl}/get_message?message=${msg}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          cache: 'no-cache',
        })
      );

      const responses = await Promise.all(endpoints);
      const results = await Promise.all(responses.map(r => r.json()));

      setMessages({
        intro_message: results[0].content || "Default invite message not available.",
        assignment_message: results[1].content || "Default assignment message not available.",
        assignment_message_startupathon: results[2].content || "Default startupathon message not available.",
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setMessagesLoading(false);
    }
  }, [apiUrl, authToken]);


  useEffect(() => {
    if (!isFetched.current) {
      fetchMessages(); // Call fetchMessages only once
      fetchListings(); // Call fetchListings only once
      isFetched.current = true; // Mark as fetched
    }
  }, [fetchMessages, fetchListings]);

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
      setListingsLoading(true);
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
      setListingsLoading(false);
    }
  };

  const handleRowClick = (rowData: AutomatedJob | NotAutomatedJob | ClosedAutomatedJob) => {
    if ("listing_name" in rowData && activeTab === "automated") {
      setSelectedRowData(rowData);
      setIsDetailModalOpen(true);
    }
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
      emp_type: empType,
      account: account,
      ctc: "",
      introMessage: "default",
      introMessageContent: "",
      followup2: "default",
      followup4: "default",
      followup2Message: "",
      followup4Message: "",
      assignmentMessage: "default",
      assignmentMessageContent: "",
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
      setListingsLoading(true);
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
      setListingsLoading(false);
    }
  };

  // Handle Add Review
  const handleAddReview = async () => {
    if (!selectedListingNumber || !reviewLink.trim()) {
      toast.error("Please provide all details.");
      return;
    }

    try {
      setListingsLoading(true);
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
      setListingsLoading(false);
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

    if (filterType === "reset") {
      return listings; // Return unfiltered data
    }

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

    const username = localStorage.getItem("userName");
  console.log("Current logged-in user:", username); // Debug log

  // Validate username
  if (!username) {
    toast.error("User session not found. Please login again.", {
      position: "top-right",
      autoClose: 3000,
    });
    return; // Stop further execution if username is missing
  }
    try {
      setListingsLoading(true);

      const payload = {
        ...automateForm,
        username,
        invite_message:
          automateForm.introMessage === "default"
            ? messages.intro_message // Use the displayed intro message
            : automateForm.introMessageContent, // Use the custom message (if provided)
        assignment_message:
          automateForm.assignmentMessage === "default"
            ? automateForm.post_over === "startupathon"
              ? messages.assignment_message_startupathon
              : messages.assignment_message
            : automateForm.assignmentMessageContent,
      };

      const response = await fetch(`${apiUrl}/automateListing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to automate listing. Please try again.");
      }

      const result = await response.json();
      toast.success(`Successfully automated listing ${result.Listing_num}`);
      setIsAutomateModalOpen(false);
      resetForm();
      fetchListings();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setListingsLoading(false);
    }
  };



  const handleOpenEditFollowupModal = (listing: AutomatedJob | NotAutomatedJob | ClosedAutomatedJob) => {
    setSelectedListing(listing);
    setIsEditFollowupModalOpen(true);
  };

  const handleUpdateFollowupMessage = async () => {
    if (!selectedListing) {
      toast.error("No listing selected.");
      return;
    }

    try {
      const payload = [
        {
          listing: selectedListing.listing_number,
          day: "d2",
          followup: day2Message,
        },
        {
          listing: selectedListing.listing_number,
          day: "d4",
          followup: day4Message,
        },
      ];

      for (const data of payload) {
        await fetch(`${apiUrl}/modify_followup`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(data),
        });
      }

      toast.success("Follow-up messages updated successfully!");
      setIsEditFollowupModalOpen(false);
      fetchListings(); // Refresh the table
    } catch (err) {
      toast.error("Failed to update messages. Please try again.");
    }
  };



  const renderTableRows = (listings: AutomatedJob[] | NotAutomatedJob[] | ClosedAutomatedJob[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = listings.slice(startIndex, startIndex + itemsPerPage);

    if (paginatedData.length === 0) {
      return (
        <tr>
          <td colSpan={activeTab === "not_automated" ? 3 : 9} className="text-center py-4 text-gray-500">
            No listings found.
          </td>
        </tr>
      );
    }

    return paginatedData.map((item, index) => (
      <tr
        key={index}
        className={`hover:bg-gray-100 transition border-b border-gray-300 ${activeTab === "automated" ? "cursor-pointer" : ""}`}
        onClick={() => {
          if (activeTab === "automated") handleRowClick(item); // Trigger modal only for Automated Listings
        }}
      >

        {/* Not Automated Listings */}
        {"listing_name" in item && activeTab === "not_automated" && (
          <>
            <td className="px-4 py-2">{item.listing_name}</td>
            <td className="px-4 py-2">{item.listing_number}</td>
            <td className="px-4 py-2">{item.expiry_date || 'N/A'}</td>
            <td className="px-4 py-2">{item.platform_data?.created_by || 'Manually Created'}</td>
            <td className="px-4 py-2 text-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenAutomateModal(item as NotAutomatedJob)
                }}
                className="px-4 py-2 bg-yellow-100 text-yellow-700 font-medium rounded-md hover:bg-yellow-200 hover:shadow-md transition border border-yellow-300"
              >
                Automate
              </button>
            </td>
          </>
        )}

        {/* Automated Listings */}
        {activeTab === "automated" && (
          <>
            {((item): item is AutomatedJob => 'metrics' in item)(item) && (
              <>
                <td className="px-4 py-2">{item.listing_name || 'N/A'}</td>
                <td className="px-4 py-2">{item.projectname || 'N/A'}</td>
                <td className="px-4 py-2">
                  {item.date ? dayjs(item.date).format("DD MMMM YYYY") : 'N/A'}
                </td>
                <td className="px-4 py-2">{item.posted_over || 'N/A'}</td>
                <td className="px-4 py-2">{item.conversion_rate || 'N/A'}</td>
                
                {/* Metrics Columns */}
                <td className="px-4 py-2 text-center">
                  {'metrics' in item ? (item as AutomatedJob).metrics.assignments_received_count : 'N/A'}
                </td>
                <td className="px-4 py-2 text-center">
                  {'metrics' in item ? (item as AutomatedJob).metrics.assignments_sent_count : 'N/A'}
                </td>
                <td className="px-4 py-2 text-center">
                  {'metrics' in item ? (item as AutomatedJob).metrics.total_new_count : 'N/A'}
                </td>
                <td className="px-4 py-2 text-center">
                  {'metrics' in item ? (item as AutomatedJob).metrics.total_applications_count : 'N/A'}
                </td>

                {/* Assignment Links Column */}
                <td className="px-4 py-2 text-blue-600">
                  {Array.isArray(item.assignment_link) && item.assignment_link.length > 0 ? (
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
                    "No Assignment Links"
                  )}
                </td>

                {/* Review Links Column */}
                <td className="px-4 py-2 text-blue-600">
                  {Array.isArray(item.review_link) && item.review_link.length > 0 ? (
                    item.review_link.map((link: string, idx: number) => (
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
                    "No Review Links"
                  )}
                </td>

                {/* Messages Column */}
                <td className="px-4 py-2">
                  <div className="truncate-text max-w-xs">
                    {item.messages?.intro || "No Intro Message"}
                  </div>
                </td>

                {/* Assignment Message Column */}
                <td className="px-4 py-2">
                  <div className="truncate-text max-w-xs">
                    {item.messages?.assignment || "No Assignment Message"}
                  </div>
                </td>

                <td className="px-4 py-2">
                  {'day2followup' in item && item.day2followup ? (
                    <>
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        item.day2followup.status === 1 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {item.day2followup.status === 1 ? "Completed" : "Pending"}
                      </span>
                      <p className="truncate-text mt-1">{item.day2followup.followup || "No Message Set"}</p>
                    </>
                  ) : "N/A"}
                </td>
                <td className="px-4 py-2">
                  {'day4followup' in item && item.day4followup ? (
                    <>
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        item.day4followup.status === 1 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {item.day4followup.status === 1 ? "Completed" : "Pending"}
                      </span>
                      <p className="truncate-text mt-1">{item.day4followup.followup || "No Message Set"}</p>
                    </>
                  ) : "N/A"}
                </td>

                <td className="px-4 py-2">{item.expiry_date || 'N/A'}</td>
                <td className="px-4 py-2">{item.platform_data?.created_by || 'N/A'}</td>
                <td className="px-4 py-2">{item.platform_data?.automated_by || 'N/A'}</td>

                <td className="px-4 py-2 text-center dropdown sticky-column "
                  onClick={(e) => e.stopPropagation()}>
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
                    <div className="dropdown-menu"
                    >
                      <button
                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                        onClick={() => handlePostAssignment(item)}
                      >
                        Post Assignment
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
                      <button
                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                        onClick={() => handleOpenEditFollowupModal(item)}
                      >
                        Edit Follow-Up Message
                      </button>
                    </div>
                  )}
                </td>
              </>
            )}
          </>
        )}
        {activeTab === "closed_automated" && (
          <>
            <td className="px-4 py-2">{item.listing_number}</td>
            <td className="px-4 py-2">{item.projectname || 'N/A'}</td>
            <td className="px-4 py-2">{item.date ? dayjs(item.date).format("DD MMMM YYYY") : 'N/A'}</td>
            <td className="px-4 py-2">{item.posted_over || 'N/A'}</td>
            <td className="px-4 py-2">{item.platform_data?.created_by || 'N/A'}</td>
            <td className="px-4 py-2">{item.platform_data?.automated_by || 'N/A'}</td>
            <td className="px-4 py-2">{item.conversion_rate || 'N/A'}</td>
            <td className="px-4 py-2">{item.metrics?.assignments_received_count || 0}</td>
            <td className="px-4 py-2">{item.metrics?.assignments_sent_count || 0}</td>
            <td className="px-4 py-2">{item.metrics?.total_applications_count || 0}</td>
            <td className="px-4 py-2 text-blue-600">
              {Array.isArray(item.assignment_link) && item.assignment_link.length > 0 ? (
                item.assignment_link.map((link, idx) => (
                  <a key={idx} href={link} target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">
                    {link.length > 20 ? `${link.substring(0, 20)}...` : link}
                  </a>
                ))
              ) : "No Links"}
            </td>
            <td className="px-4 py-2 text-blue-600">
              {Array.isArray(item.review_link) && item.review_link.length > 0 ? (
                item.review_link.map((link, idx) => (
                  <a key={idx} href={link} target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">
                    {link.length > 20 ? `${link.substring(0, 20)}...` : link}
                  </a>
                ))
              ) : "No Links"}
            </td>
          </>
        )}
      </tr>
    ));
  };

  const renderPagination = (totalItems: number) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages === 0) return null;

    return (
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">
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
    if (listingsLoading) return <p className="text-gray-500">Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    const filteredListings = filterListings();

    return (
      <div className="relative">
        <div className="overflow-x-auto">
          <table className="table-auto w-full border  bg-white border-gray-300 rounded-lg shadow-lg">
            <thead className="bg-gray-200">
              <tr>
                {activeTab === "not_automated" && (
                  <>
                    <th className="px-4 py-2 text-left">Listing Name</th>
                    <th className="px-4 py-2 text-left">Listing Number</th>
                    <th className="px-4 py-2 text-left">Expiry Date</th>
                    <th className="px-4 py-2 text-left">Created By</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </>
                )}
                {activeTab === "automated" && (
                  <>
                    <th className="px-4 py-2 text-left">Listing Name</th>
                    <th className="px-4 py-2 text-left">Project Name</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Posted Over</th>
                    <th className="px-4 py-2 text-left">Conversion Rate</th>
                    <th className="px-4 py-2 text-left">Assignments Received</th>
                    <th className="px-4 py-2 text-left">Assignments Sent</th>
                    <th className="px-4 py-2 text-left">New Applicants</th>
                    <th className="px-4 py-2 text-left">Total Applications</th>
                    <th className="px-4 py-2 text-left">Assignment Links</th>
                    <th className="px-4 py-2 text-left">Review Links</th>
                    <th className="px-4 py-2 text-left">Intro Message</th>
                    <th className="px-4 py-2 text-left">Assignment Message</th>
                    <th className="px-4 py-2 text-left">Day-2 Followup</th>
                    <th className="px-4 py-2 text-left">Day-4 Followup</th>
                    <th className="px-4 py-2 text-left">Expiry Date</th>
                    <th className="px-4 py-2 text-left">Created By</th>
                    <th className="px-4 py-2 text-left">Automated By</th>
                    <th className="sticky right-0 bg-gray-200 px-4 py-2 text-left">Actions</th>
                  </>
                )}
                {activeTab === "closed_automated" && (
                  <>
                    <th className="px-4 py-2 text-left">Listing Number</th>
                    <th className="px-4 py-2 text-left">Project Name</th>
                    <th className="px-4 py-2 text-left">Posted Date</th>
                    <th className="px-4 py-2 text-left">Posted Over</th>
                    <th className="px-4 py-2 text-left">Created By</th>
                    <th className="px-4 py-2 text-left">Automated By</th>
                    <th className="px-4 py-2 text-left">Conversion Rate</th>
                    <th className="px-4 py-2 text-left">Assignments Received</th>
                    <th className="px-4 py-2 text-left">Assignments Sent</th>
                    <th className="px-4 py-2 text-left">Total Applications</th>
                    <th className="px-4 py-2 text-left">Assignment Links</th>
                    <th className="px-4 py-2 text-left">Review Links</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>{renderTableRows(filteredListings)}</tbody>
          </table>
        </div>
        {renderPagination(filteredListings.length)}
      </div>
    );
  };


  return (
    <div className="p-2 bg-gray-100 min-h-screen max-w-[100vw] ">
      {listingsLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <TailSpin height="80" width="80" color="#4fa94d" ariaLabel="loading" />
        </div>
      )}
      <ToastContainer />

      <div className="bg-gray-50 min-h-screen max-w-[100vw]">
        <div className="max-w-8xl mx-auto bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-semibold text-gray-900  text-center sm:text-left">Auto Listings</h1>
              <p className="text-gray-500 mt-1 text-center sm:text-left mb-2">
                Manage and automate your job and internship listings efficiently.
              </p>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center ">
              <input
                type="text"
                placeholder="Type to Start Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-auto p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                max-[600px]:w-[90%]
                "
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full md:w-auto p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                max-[600px]:w-[90%]
                "
              >
                <option value="reset">Default</option>
                <option value="listing_name">Listing Name</option>
                <option value="project_name">Project Name</option>
              </select>
            </div>


          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 text-center sm:text-left">
            {/* Employment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Type
              </label>
              <select
                value={empType}
                onChange={handleEmpTypeChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition max-[600px]:w-[90%] "
              >
                <option value="job">Job</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            {/* Account */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account
              </label>
              <select
                value={account}
                onChange={handleAccountChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition max-[600px]:w-[90%]"
              >
                <option value="pv">PV</option>
                <option value="sa">SA</option>
              </select>
            </div>

            {/* Fetch Listings Button */}
            <div className="flex items-end justify-center">
              <button
                onClick={fetchListings}
                className="w-full md:w-auto px-6 py-3 bg-blue-100 text-blue-600 font-medium rounded-lg shadow-sm hover:bg-blue-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 transition border border-blue-300 max-[600px]:w-[90%]"
              >
                Fetch Listings
              </button>
            </div>
          </div>



          <div className="flex space-x-4 mb-6 max-[600px]:flex-col max-[600px]:items-center">
            {/* Automated Listings Button */}
            <button
              onClick={() => handleActiveTabChange("automated")}
              className={`w-[75%] mb-2 md:w-auto px-4 py-2 rounded-lg shadow-md transition ${activeTab === "automated"
                ? "bg-yellow-50 text-yellow-600 font-semibold border border-yellow-300"
                : "bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100"
                } focus:outline-none focus:ring-2 focus:ring-yellow-400`}
            >
              Automated Listings
            </button>

            {/* Not Automated Listings Button */}
            <button
              onClick={() => handleActiveTabChange("not_automated")}
              className={`w-[75%] mb-2 md:w-auto px-4 py-2 rounded-lg shadow-md transition ${activeTab === "not_automated"
                ? "bg-green-50 text-green-600 font-semibold border border-green-300"
                : "bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100"
                } focus:outline-none focus:ring-2 focus:ring-green-400`}
            >
              Not Automated Listings
            </button>

            {/* Closed Listings Button */}
            <button
              onClick={() => handleActiveTabChange("closed_automated")}
              className={`w-[75%] mb-2 md:w-auto px-4 py-2 rounded-lg shadow-md transition ${activeTab === "closed_automated"
                ? "bg-red-50 text-red-600 font-semibold border border-red-300"
                : "bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100"
                } focus:outline-none focus:ring-2 focus:ring-red-400`}
            >
              Expired Listings
            </button>
          </div>



          {renderTable()}
        </div>
      </div>

      {/* Make Announcement Modal */}
      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => setIsAnnouncementModalOpen(false)}
            >
              ✕
            </button>

            {/* Modal Title */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Make Announcement</h2>

            {/* Message Label and Textarea */}
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="announcementMessage"
            >
              Message
            </label>
            <textarea
              id="announcementMessage"
              value={announcementMessage}
              onChange={(e) => setAnnouncementMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              rows={4}
              placeholder="Type your announcement here..."
            ></textarea>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              {/* Cancel Button */}
              <button
                onClick={() => setIsAnnouncementModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-600 font-medium rounded-lg shadow-sm hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>

              {/* Submit Button */}
              <button
                onClick={handleMakeAnnouncement}
                className={`px-4 py-2 font-medium rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${announcementMessage.trim()
                  ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                disabled={!announcementMessage.trim()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Add Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => setIsReviewModalOpen(false)}
            >
              ✕
            </button>

            {/* Modal Title */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Review</h2>

            {/* Review Link Label and Input */}
            <label
              htmlFor="reviewLink"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Review Link
            </label>
            <input
              id="reviewLink"
              type="text"
              value={reviewLink}
              onChange={(e) => setReviewLink(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Enter the review link..."
            />

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              {/* Cancel Button */}
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-600 font-medium rounded-lg shadow-sm hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>

              {/* Submit Button */}
              <button
                onClick={handleAddReview}
                className={`px-4 py-2 font-medium rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${reviewLink.trim()
                  ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                disabled={!reviewLink.trim()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Assignment Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => setIsPostModalOpen(false)}
            >
              ✕
            </button>

            {/* Modal Title */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Assignment URL</h2>

            {/* Input Field */}
            <input
              type="text"
              value={postURL}
              onChange={(e) => setPostURL(e.target.value)}
              placeholder="Enter assignment URL"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              {/* Cancel Button */}
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-600 font-medium rounded-lg shadow-sm hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>

              {/* Submit Button */}
              <button
                onClick={confirmPostAssignment}
                className={`px-4 py-2 font-medium rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-green-400 ${postURL.trim()
                  ? "bg-green-100 text-green-600 hover:bg-green-200"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                disabled={!postURL.trim()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditFollowupModalOpen && selectedListing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
              onClick={() => setIsEditFollowupModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Follow-Up Message</h2>

            {/* Day 2 Message */}
            <label htmlFor="day2Message" className="block text-sm font-medium text-gray-700 mb-2">
              Day 2 Follow-Up
            </label>
            <input
              id="day2Message"
              type="text"
              value={day2Message}
              onChange={(e) => setDay2Message(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />

            {/* Day 4 Message */}
            <label htmlFor="day4Message" className="block text-sm font-medium text-gray-700 mt-4 mb-2">
              Day 4 Follow-Up
            </label>
            <input
              id="day4Message"
              type="text"
              value={day4Message}
              onChange={(e) => setDay4Message(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />

            {/* Action Buttons */}
            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={() => setIsEditFollowupModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-600 font-medium rounded-lg shadow-sm hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateFollowupMessage}
                className="px-4 py-2 bg-blue-100 text-blue-600 font-medium rounded-lg shadow-sm hover:bg-blue-200 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Update Message
              </button>
            </div>
          </div>
        </div>
      )}

      {isDetailModalOpen && selectedRowData && (
        <div className="max-w-[100vw] max-h-[100vh] fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative w-[95%] max-w-7xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center">
                <DocumentTextIcon className="mr-3 w-7 h-7" />
                Listing Details
                <span className="ml-4 text-lg font-medium text-gray-200 truncate max-w-[300px]">
                  - {"listing_name" in selectedRowData ? selectedRowData.listing_name : "N/A"}
                </span>
              </h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="group transition-all duration-300 hover:rotate-90 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-full p-2"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
              {/* Main Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl">
                {[
                  { label: "Listing Name", value: "listing_name" in selectedRowData ? selectedRowData.listing_name : "N/A" },
                  { label: "Project Name", value: "projectname" in selectedRowData ? selectedRowData.projectname : "N/A" },
                  { label: "Date", value: "date" in selectedRowData ? dayjs(selectedRowData.date).format("DD MMMM YYYY") : "N/A" },
                  { label: "Conversion Rate", value: "conversion_rate" in selectedRowData ? selectedRowData.conversion_rate : "N/A" }
                ].map(({ label, value }) => (
                  <div key={label} className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <p className="text-lg font-semibold text-gray-800 truncate">{value}</p>
                  </div>
                ))}
              </div>

              {/* Messages Section */}
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Intro Message",
                    icon: HandThumbUpIcon,
                    content: "messages" in selectedRowData ? selectedRowData.messages?.intro : "N/A",
                    bgColor: "bg-blue-50"
                  },
                  {
                    title: "Assignment Message",
                    icon: DocumentTextIcon,
                    content: "messages" in selectedRowData ? selectedRowData.messages?.assignment : "N/A",
                    bgColor: "bg-green-50"
                  }
                ].map(({ title, icon: Icon, content, bgColor }) => (
                  <div key={title} className={`${bgColor} p-4 rounded-xl space-y-3`}>
                    <div className="flex items-center text-blue-700">
                      <Icon className="mr-2 w-5 h-5" />
                      <h3 className="font-semibold">{title}</h3>
                    </div>
                    <p className="text-gray-700 whitespace-pre-line overflow-auto max-h-[150px]">
                      {content || "No message available"}
                    </p>
                  </div>
                ))}
              </div>

              {/* Links Section */}
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Assignment Links",
                    links: "assignment_link" in selectedRowData ? selectedRowData.assignment_link : [],
                    emptyMessage: "No assignment links"
                  },
                  {
                    title: "Review Links",
                    links: "review_link" in selectedRowData ? selectedRowData.review_link : [],
                    emptyMessage: "No review links"
                  }
                ].map(({ title, links, emptyMessage }) => (
                  <div key={title} className="bg-gray-100 p-4 rounded-xl">
                    <h3 className="font-semibold mb-3 text-gray-700">{title}</h3>
                    {links?.length ? (
                      <ul className="space-y-2">
                        {links.map((link, index) => (
                          <li key={index} className="truncate">
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                            >
                              {link}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">{emptyMessage}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Followup Messages */}
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Day 2 Followup",
                    message: "day2followup" in selectedRowData ? selectedRowData.day2followup?.followup : "N/A",
                    bgColor: "bg-yellow-50"
                  },
                  {
                    title: "Day 4 Followup",
                    message: "day4followup" in selectedRowData ? selectedRowData.day4followup?.followup : "N/A",
                    bgColor: "bg-red-50"
                  }
                ].map(({ title, message, bgColor }) => (
                  <div key={title} className={`${bgColor} p-4 rounded-xl`}>
                    <h3 className="font-semibold mb-2 text-gray-700">{title}</h3>
                    <p className="text-gray-600 whitespace-pre-line overflow-auto max-h-[100px]">
                      {message || "No message set"}
                    </p>
                  </div>
                ))}
              </div>

              {/* Add after existing sections but before the modal footer */}
              <div className="mt-6 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Posting Details</h3>
                  <div className="text-sm text-gray-600">
                    Posted Over: <span className="font-medium text-gray-800">{('posted_over' in selectedRowData) ? selectedRowData.posted_over : 'N/A'}</span>
                  </div>
                </div>

                {'metrics' in selectedRowData && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Metrics Overview</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-sm text-gray-600">
                        Assignments Received: <span className="font-medium text-gray-800">{selectedRowData.metrics?.assignments_received_count || 0}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Assignments Sent: <span className="font-medium text-gray-800">{selectedRowData.metrics?.assignments_sent_count || 0}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        New Applicants: <span className="font-medium text-gray-800">{selectedRowData.metrics?.total_new_count || 0}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Total Applications: <span className="font-medium text-gray-800">{selectedRowData.metrics?.total_applications_count || 0}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Additional Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm text-gray-600">
                      Expiry Date: <span className="font-medium text-gray-800">{selectedRowData.expiry_date || 'N/A'}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Created By: <span className="font-medium text-gray-800">{selectedRowData.platform_data?.created_by || 'N/A'}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Automated By: <span className="font-medium text-gray-800">{selectedRowData.platform_data?.automated_by || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}



      {isAutomateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          {messagesLoading ? (
            <div className="flex justify-center items-center">
              <TailSpin height="50" width="50" color="#4fa94d" ariaLabel="loading" />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl relative overflow-hidden">
              {/* Header Section */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                  <MdOutlineBusinessCenter className="text-blue-500 mr-3" />
                  Automate Listing
                </h2>
                <button
                  onClick={() => setIsAutomateModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Content Section */}
              <div className="p-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
                <div className="space-y-8">
                  {/* Basic Information Section */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                        <input
                          type="text"
                          value={automateForm.name}
                          onChange={(e) => setAutomateForm((prev) => ({ ...prev, name: e.target.value }))}
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter project name"
                        />
                      </div>

                      <div>
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
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="assignment">Assignment</option>
                          <option value="offer">Offer</option>
                        </select>
                      </div>

                      {automateForm.process === "offer" && (
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                          <input
                            type="text"
                            value={automateForm.designation}
                            onChange={(e) =>
                              setAutomateForm((prev) => ({
                                ...prev,
                                designation: e.target.value,
                              }))
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter designation"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Assignment Details Section */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Assignment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Link</label>
                        <input
                          type="text"
                          value={automateForm.assignment_link}
                          onChange={(e) =>
                            setAutomateForm((prev) => ({
                              ...prev,
                              assignment_link: e.target.value,
                            }))
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter assignment link"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Post Over</label>
                        <select
                          value={automateForm.post_over}
                          onChange={(e) =>
                            setAutomateForm((prev) => ({ ...prev, post_over: e.target.value }))}
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="normal">Normal</option>
                          <option value="startupathon">Startupathon</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CTC</label>
                        <input
                          type="text"
                          value={automateForm.ctc}
                          onChange={(e) =>
                            setAutomateForm((prev) => ({ ...prev, ctc: e.target.value }))}
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter CTC"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Messages Section */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">Messages</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Intro Message */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Intro Message</label>
                        <select
                          value="default"
                          disabled
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="default">Default</option>
                        </select>
                        <div className="mt-2 h-32 overflow-y-auto rounded-lg border border-gray-200">
                          <div className="p-3 bg-gray-50 text-gray-700 text-sm whitespace-pre-line">
                            {messages.intro_message}
                          </div>
                        </div>
                      </div>

                      {/* Assignment Message */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Message</label>
                        <select
                          value={automateForm.assignmentMessage}
                          onChange={(e) => {
                            const value = e.target.value;
                            setAutomateForm((prev) => ({
                              ...prev,
                              assignmentMessage: value,
                              assignmentMessageContent: automateForm.post_over === "startupathon"
                                ? messages.assignment_message_startupathon
                                : messages.assignment_message
                            }));
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="default">Default</option>
                          <option value="custom">Custom Message</option>
                        </select>
                        <div className="mt-2">
                          {automateForm.assignmentMessage === "custom" ? (
                            <div>
                              <textarea
                                value={automateForm.assignmentMessageContent}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const linkCount = (value.match(/https?:\/\/[^\s]+/g) || []).length;
                                  setAutomateForm((prev) => ({
                                    ...prev,
                                    assignmentMessageContent: value,
                                  }));
                                  if (linkCount < 2) {
                                    toast.warning("Please include at least 2 links: one for assignment and one for updates");
                                  }
                                }}
                                className={`w-full h-32 p-3 border ${(automateForm.assignmentMessageContent.match(/https?:\/\/[^\s]+/g) || []).length < 2
                                  ? "border-yellow-300"
                                  : "border-gray-300"
                                  } rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
                                placeholder="Enter custom message with at least 2 links"
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                Message should contain at least 2 links:
                                <br />
                                1. Assignment link (xx_assignment_xx)
                                <br />
                                2. Updates link (xx_bot_xx)
                              </p>
                            </div>
                          ) : (
                            <div className="h-32 overflow-y-auto rounded-lg border border-gray-200">
                              <div className="p-3 bg-gray-50 text-gray-700 text-sm whitespace-pre-line">
                                {automateForm.post_over === "startupathon"
                                  ? messages.assignment_message_startupathon
                                  : messages.assignment_message}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Follow-up Messages */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Day 2 Follow-up</label>
                        <select
                          value={automateForm.followup2}
                          onChange={(e) => {
                            setAutomateForm((prev) => ({
                              ...prev,
                              followup2: e.target.value,
                            }));
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="default">Default</option>
                          <option value="custom">Custom Message</option>
                        </select>
                        {automateForm.followup2 === "custom" && (
                          <input
                            type="text"
                            placeholder="Enter Day 2 follow-up message"
                            value={automateForm.followup2Message || ""}
                            onChange={(e) =>
                              setAutomateForm((prev) => ({
                                ...prev,
                                followup2Message: e.target.value,
                              }))
                            }
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Day 4 Follow-up</label>
                        <select
                          value={automateForm.followup4}
                          onChange={(e) => {
                            setAutomateForm((prev) => ({
                              ...prev,
                              followup4: e.target.value,
                            }));
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="default">Default</option>
                          <option value="custom">Custom Message</option>
                        </select>
                        {automateForm.followup4 === "custom" && (
                          <input
                            type="text"
                            placeholder="Enter Day 4 follow-up message"
                            value={automateForm.followup4Message || ""}
                            onChange={(e) =>
                              setAutomateForm((prev) => ({
                                ...prev,
                                followup4Message: e.target.value,
                              }))
                            }
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Section */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-4">
                <button
                  onClick={() => setIsAutomateModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAutomateListing}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Automate Listing
                </button>
              </div>
            </div>
          )}
        </div>
      )}


    </div>
  );
};

export default AutoListingsPage;