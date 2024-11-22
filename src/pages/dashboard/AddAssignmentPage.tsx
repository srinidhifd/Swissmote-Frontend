import React, { useState } from "react";

const AddAssignmentPage: React.FC = () => {
  const [listingNumber, setListingNumber] = useState("");
  const [assignmentLinks, setAssignmentLinks] = useState<string[]>([""]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAddLink = () => {
    setAssignmentLinks([...assignmentLinks, ""]);
  };

  const handleLinkChange = (index: number, value: string) => {
    const updatedLinks = [...assignmentLinks];
    updatedLinks[index] = value;
    setAssignmentLinks(updatedLinks);
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = assignmentLinks.filter((_, i) => i !== index);
    setAssignmentLinks(updatedLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!listingNumber.trim() || assignmentLinks.some((link) => !link.trim())) {
      setError("Listing number and all assignment links are required!");
      return;
    }

    try {
      const response = await fetch(
        "https://api.trollgold.org/persistventures/assignment/add_assignment",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            listing: Number(listingNumber),
            link: assignmentLinks,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add the assignment. Please try again.");
      }

      const result = await response.json();
      setSuccessMessage(result.message || "Assignment link was updated successfully!");
      setListingNumber("");
      setAssignmentLinks([""]);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Add Assignment</h1>
        <p className="text-gray-600 mb-8">
          Upload new assignment links to the system.
        </p>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Listing Number <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={listingNumber}
              onChange={(e) => setListingNumber(e.target.value)}
              placeholder="Enter listing number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignment Links <span className="text-red-500">*</span>
            </label>
            {assignmentLinks.map((link, index) => (
              <div key={index} className="flex items-center space-x-2 mb-3">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                  placeholder="https://example.com/assignment"
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {assignmentLinks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddLink}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              + Add Another Link
            </button>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Assignment
          </button>
        </form>

      </div>
    </div>
  );
};

export default AddAssignmentPage;
