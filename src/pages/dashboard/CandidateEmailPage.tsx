import { useState } from "react";
import axios from "axios";

const CandidateEmailPage = () => {
  const [candidateId, setCandidateId] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("");
  const [organizations] = useState([
    { value: "Org 1", label: "Organization 1" },
    { value: "Org 2", label: "Organization 2" },
  ]);
  const [emailData, setEmailData] = useState("");
  const [error, setError] = useState("");

  const fetchCandidateEmail = async () => {
    setError("");
    setEmailData("");

    if (!candidateId || !selectedOrg) {
      setError("Both Candidate ID and Organization are required.");
      return;
    }

    try {
      const response = await axios.get(
        `https://api.trollgold.org/persistventures/assignment/candidateEmail`,
        {
          params: {
            candidate_id: candidateId,
            org: selectedOrg,
          },
        }
      );
      if (response.data.success) {
        setEmailData(response.data.email || "No email found");
      } else {
        setError("Candidate email not found.");
      }
    } catch (err) {
      setError("Failed to fetch candidate email. Please try again.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Get Candidate Email</h1>
        <p className="text-gray-600 mb-6">Retrieve candidate email information.</p>

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

            {/* Organization Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select organization
                </option>
                {organizations.map((org) => (
                  <option key={org.value} value={org.value}>
                    {org.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fetch Button */}
          <button
            onClick={fetchCandidateEmail}
            className="w-full mt-4 md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Fetch Email
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Success Message */}
          {emailData && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
              <strong>Candidate Email:</strong> {emailData}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateEmailPage;
