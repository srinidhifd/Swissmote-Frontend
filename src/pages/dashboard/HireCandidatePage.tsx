import React, { useState } from "react";
import axios from "axios";

const HireCandidatePage: React.FC = () => {
  const [listing, setListing] = useState("");
  const [candidateIds, setCandidateIds] = useState<string[]>([""]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleHireCandidates = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!listing.trim() || candidateIds.some((id) => !id.trim())) {
      setError("Listing Number and Candidate IDs are required.");
      return;
    }

    const candidateIdsInt = candidateIds.map((id) => Number(id.trim()));

    try {
      const response = await axios.post(
        `https://api.trollgold.org/persistventures/assignment/hire_candidate?listing=${listing}`,
        {
          candidate_id: candidateIdsInt,
        }
      );

      if (response.data.success) {
        setSuccessMessage("Candidates hired successfully!!");
        setListing("");
        setCandidateIds([""]);
      } else {
        setError("Failed to hire candidates. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while hiring candidates.");
    }
  };

  const handleAddCandidate = () => {
    setCandidateIds([...candidateIds, ""]);
  };

  const handleRemoveCandidate = (index: number) => {
    const newCandidateIds = candidateIds.filter((_, idx) => idx !== index);
    setCandidateIds(newCandidateIds);
  };

  const handleCandidateChange = (index: number, value: string) => {
    const newCandidateIds = [...candidateIds];
    newCandidateIds[index] = value;
    setCandidateIds(newCandidateIds);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Hire Candidates</h1>
        <p className="text-gray-600 mb-6">
          Select candidates to hire for a specific listing. This action is permanent and will update the candidates' status.
        </p>

        <div className="space-y-6">
          {/* Listing Number Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Listing Number <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={listing}
              onChange={(e) => setListing(e.target.value)}
              placeholder="Enter listing number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Candidate IDs Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Candidate IDs
            </label>
            {candidateIds.map((id, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="number"
                  value={id}
                  onChange={(e) => handleCandidateChange(index, e.target.value)}
                  placeholder="Enter candidate ID"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCandidate(index)}
                    className="ml-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddCandidate}
              className="mt-2 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              + Add Another Candidate
            </button>
          </div>

          {/* Hire Candidates Button */}
          <button
            onClick={handleHireCandidates}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Hire Selected Candidates
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
        </div>
      </div>
    </div>
  );
};

export default HireCandidatePage;
