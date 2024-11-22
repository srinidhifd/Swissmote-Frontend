import { useState } from "react";
import axios from "axios";

const MarkEvaluationPage: React.FC = () => {
  const [candidateId, setCandidateId] = useState("");
  const [listingNumber, setListingNumber] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMarkEvaluation = async () => {
    setSuccessMessage(null);
    setError(null);

    if (!candidateId || !listingNumber) {
      setError("Both Candidate ID and Listing Number are required.");
      return;
    }

    try {
      const response = await axios.patch(
        `https://api.trollgold.org/persistventures/assignment/mark_eval_internshala`,
        null,
        {
          params: {
            candidate_id: candidateId,
            listing: listingNumber,
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage("Applicant assignment marked as evaluated successfully!");
        setCandidateId("");
        setListingNumber("");
      } else {
        setError("Failed to mark the evaluation. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while marking the evaluation. Please try again.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Mark Evaluation</h1>
        <p className="text-gray-600 mb-6">
          Complete the candidate evaluation process. Please ensure all information is correct before submitting. This action cannot be undone.
        </p>

        <div className="space-y-6">
          {/* Candidate ID Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Candidate ID <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={candidateId}
                onChange={(e) => setCandidateId(e.target.value)}
                placeholder="Enter candidate ID"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Listing Number Input */}
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
          </div>

          {/* Mark Evaluation Button */}
          <button
            onClick={handleMarkEvaluation}
            className="w-full mt-4 md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Mark Evaluation
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

export default MarkEvaluationPage;
