import { useState } from "react";

const PostFullTimeJobPage = () => {
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [type, setType] = useState("virtual");
  const [jobPartFull, setJobPartFull] = useState<"part" | "full">("full");
  const [numPosition, setNumPosition] = useState<number | "">("");
  const [minExperience, setMinExperience] = useState<number | "">("");
  const [minSalary, setMinSalary] = useState<number | "">("");
  const [maxSalary, setMaxSalary] = useState<number | "">("");
  const [organization, setOrganization] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const organizations = ["Org 1", "Org 2", "Org 3"]; // Example organizations

  const handleSave = async () => {
    // Validate input fields
    if (!title.trim()) {
      setError("Job Title is required.");
      return;
    }
    if (skills.length === 0) {
      setError("Please enter at least one skill.");
      return;
    }
    if (!organization) {
      setError("Please select an organization.");
      return;
    }

    // Build job data object
    const jobData = {
      job_title: title,
      skills,
      job_type: type,
      job_part_full: jobPartFull,
      num_position: Number(numPosition),
      min_experience: Number(minExperience),
      min_salary: Number(minSalary),
      max_salary: Number(maxSalary),
      account: organization,
    };

    try {
      const response = await fetch(
        "https://api.trollgold.org/persistventures/assignment/make_Job",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(jobData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to post the job. Please try again.");
      }

      const data = await response.json();
      setSuccessMessage(data.message || "Job posted successfully!");
      setError(null);

      // Reset form fields
      setTitle("");
      setSkills([]);
      setType("virtual");
      setJobPartFull("full");
      setNumPosition("");
      setMinExperience("");
      setMinSalary("");
      setMaxSalary("");
      setOrganization("");
    } catch (error: any) {
      setError(error.message || "Something went wrong.");
      setSuccessMessage(null);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen w-100">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Post Full-Time Job</h1>
        <p className="text-gray-600 mb-8">
          Create a professional job posting to attract the best talent for your organization.
        </p>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(null);
              }}
              placeholder="e.g., Software Engineer"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
            <input
              type="text"
              value={skills.join(", ")}
              onChange={(e) =>
                setSkills(e.target.value.split(",").map((skill) => skill.trim()))
              }
              placeholder="e.g., React, Node.js"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Work Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="virtual">Virtual</option>
              <option value="in-person">In-Person</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
            <select
              value={jobPartFull}
              onChange={(e) => setJobPartFull(e.target.value as "part" | "full")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="part">Part-Time</option>
              <option value="full">Full-Time</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Positions</label>
            <input
              type="number"
              value={numPosition}
              onChange={(e) => setNumPosition(e.target.value ? Number(e.target.value) : "")}
              placeholder="e.g., 5"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Experience</label>
            <input
              type="number"
              value={minExperience}
              onChange={(e) => setMinExperience(e.target.value ? Number(e.target.value) : "")}
              placeholder="e.g., 3 years"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Salary</label>
            <input
              type="number"
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value ? Number(e.target.value) : "")}
              placeholder="e.g., 50000"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Salary</label>
            <input
              type="number"
              value={maxSalary}
              onChange={(e) => setMaxSalary(e.target.value ? Number(e.target.value) : "")}
              placeholder="e.g., 100000"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
            <select
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an Organization</option>
              {organizations.map((org) => (
                <option key={org} value={org}>
                  {org}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSave}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Post Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostFullTimeJobPage;
