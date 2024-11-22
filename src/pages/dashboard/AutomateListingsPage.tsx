import { useState } from "react";

const AutomateListingsPage = () => {
  const [listingNumber, setListingNumber] = useState("");
  const [name, setName] = useState("");
  const [processType, setProcessType] = useState("offer");
  const [designation, setDesignation] = useState("");
  const [assignmentLink, setAssignmentLink] = useState("");
  const [account, setAccount] = useState("Org 1");
  const [activeStatus, setActiveStatus] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    // Validate input fields
    if (!listingNumber.trim()) {
      setError("Listing Number is required.");
      return;
    }
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!designation.trim()) {
      setError("Designation is required.");
      return;
    }
    if (!assignmentLink.trim()) {
      setError("Assignment link is required.");
      return;
    }

    // Build request body
    const automateListingData = {
      listing: Number(listingNumber),
      name,
      process: processType,
      assignment_link: assignmentLink,
      designation,
      active_status: activeStatus,
      account,
    };

    try {
      setLoading(true);
      const response = await fetch(
        "https://api.trollgold.org/persistventures/assignment/automate_Listing",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(automateListingData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to automate the listing. Please try again.");
      }

      const data = await response.json();
      setSuccessMessage(data.message || "Listing automated successfully!");
      setError(null);

      // Reset fields after submission
      setListingNumber("");
      setName("");
      setProcessType("offer");
      setDesignation("");
      setAssignmentLink("");
      setAccount("Org 1");
      setActiveStatus(true);
    } catch (error: any) {
      setError(error.message || "Something went wrong.");
      setSuccessMessage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Automate Listing</h1>
        <p className="text-gray-600 mb-8">
          Configure automation settings for your listing.
        </p>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Listing Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={listingNumber}
              onChange={(e) => {
                setListingNumber(e.target.value);
                setError(null);
              }}
              placeholder="e.g., 12345"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder="Enter name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Process Type <span className="text-red-500">*</span>
            </label>
            <select
              value={processType}
              onChange={(e) => setProcessType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="offer">Offer</option>
              <option value="interview">Interview</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Designation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={designation}
              onChange={(e) => {
                setDesignation(e.target.value);
                setError(null);
              }}
              placeholder="Enter designation"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment Link <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={assignmentLink}
              onChange={(e) => {
                setAssignmentLink(e.target.value);
                setError(null);
              }}
              placeholder="Enter assignment link"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account <span className="text-red-500">*</span>
            </label>
            <select
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Org 1">Organization One</option>
              <option value="Org 2">Organization Two</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="flex items-center mb-6">
            <input
              type="checkbox"
              checked={activeStatus}
              onChange={() => setActiveStatus((prev) => !prev)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Active Status</span>
          </label>

          <button
            onClick={handleSave}
            disabled={loading}
            className={`w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Automating..." : "Automate Listing"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutomateListingsPage;
