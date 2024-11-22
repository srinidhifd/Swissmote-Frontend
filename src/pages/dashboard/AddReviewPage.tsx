import React, { useState } from "react";
import axios from "axios";

const AddReviewPage: React.FC = () => {
  const [listingNumber, setListingNumber] = useState("");
  const [reviewLinks, setReviewLinks] = useState<string[]>([""]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddAnotherLink = () => {
    setReviewLinks([...reviewLinks, ""]);
  };

  const handleLinkChange = (index: number, value: string) => {
    const updatedLinks = [...reviewLinks];
    updatedLinks[index] = value;
    setReviewLinks(updatedLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!listingNumber) {
      setError("Listing number cannot be empty.");
      return;
    }

    if (reviewLinks.some((link) => !link)) {
      setError("All review links must be filled out.");
      return;
    }

    try {
      const response = await axios.put(
        "https://api.trollgold.org/persistventures/assignment/add_review",
        {
          listing: parseInt(listingNumber),
          link: reviewLinks,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage("Review link was updated successfully!");
        setListingNumber("");
        setReviewLinks([""]);
      } else {
        setError("Failed to update review link. Please try again.");
      }
    } catch (err) {
      setError("Error updating review link. Please try again later.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Review</h1>
        <p className="text-gray-600 mb-6">
          Add review links for a specific listing. Multiple review links can be added if needed.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Listing Number Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Listing Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={listingNumber}
              onChange={(e) => setListingNumber(e.target.value)}
              placeholder="Enter listing number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Review Links Input */}
          {reviewLinks.map((link, index) => (
            <div key={index} className="flex items-center space-x-4">
              <input
                type="text"
                value={link}
                onChange={(e) => handleLinkChange(index, e.target.value)}
                placeholder="Enter review link"
                className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {index === reviewLinks.length - 1 && (
                <button
                  type="button"
                  onClick={handleAddAnotherLink}
                  className="text-blue-500 hover:underline"
                >
                  + Add Another Review Link
                </button>
              )}
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            Add Review
          </button>

          {/* Success and Error Messages */}
          {successMessage && (
            <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddReviewPage;
