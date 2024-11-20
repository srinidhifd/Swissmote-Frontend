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
      setEmailData(response.data.email || "No email found");
    } catch (err) {
      setError("Failed to fetch candidate email. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Candidate Email</h1>
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        {/* Candidate ID Input */}
        <div>
          <label
            htmlFor="candidateId"
            className="block text-sm font-medium text-gray-700"
          >
            Candidate ID
          </label>
          <input
            type="text"
            id="candidateId"
            value={candidateId}
            onChange={(e) => setCandidateId(e.target.value)}
            placeholder="Enter candidate ID"
            className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Organization Dropdown */}
        <div>
          <label
            htmlFor="organization"
            className="block text-sm font-medium text-gray-700"
          >
            Select Organization
          </label>
          <select
            id="organization"
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="" disabled>
              -- Select an organization --
            </option>
            {organizations.map((org) => (
              <option key={org.value} value={org.value}>
                {org.label}
              </option>
            ))}
          </select>
        </div>

        {/* Fetch Button */}
        <button
          onClick={fetchCandidateEmail}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Fetch Email
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-800 rounded-md">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Success Message */}
        {emailData && (
          <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-md">
            <strong>Candidate Email:</strong> {emailData}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateEmailPage;
