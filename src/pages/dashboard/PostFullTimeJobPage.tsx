import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin } from "react-loader-spinner";
import { AiOutlineFileText, AiOutlineNumber, AiOutlineDollarCircle } from "react-icons/ai";
import { MdOutlineWork, MdOutlineBusinessCenter } from "react-icons/md";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { FaRegBuilding } from "react-icons/fa";

const PostFullTimeJobPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const authToken = import.meta.env.VITE_AUTH_TOKEN;

  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [type, setType] = useState("virtual");
  const [jobPartFull, setJobPartFull] = useState<"part" | "full">("full");
  const [numPosition, setNumPosition] = useState<number | "">("");
  const [minExperience, setMinExperience] = useState<number | "">("");
  const [minSalary, setMinSalary] = useState<number | "">("");
  const [maxSalary, setMaxSalary] = useState<number | "">("");
  const [organization, setOrganization] = useState<"pv" | "sa" | "">("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Job Title is required.", { position: "top-right", autoClose: 3000 });
      return;
    }
    if (skills.length === 0) {
      toast.error("Please enter at least one skill.", { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!organization) {
      toast.error("Please select an organization.", { position: "top-right", autoClose: 3000 });
      return;
    }
    if (Number(minSalary) < 200000) {
      toast.error("Minimum salary must be at least 200,000.", { position: "top-right", autoClose: 3000 });
      return;
    }

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
      post_on_linkedin: false,
    };

    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/postJob?dev=true`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error("Failed to post the job. Please try again.");
      }

      const data = await response.json();
      toast.success(data.message || "Job posted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

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
      toast.error(error.message || "Something went wrong.", { position: "top-right", autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <TailSpin height="50" width="50" color="#4fa94d" ariaLabel="loading" />
            <p className="text-gray-600 mt-2">Posting job...</p>
          </div>
        </div>
      )}

      <ToastContainer />

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <MdOutlineBusinessCenter className="text-blue-500 mr-3 text-4xl" />
            Post Full-Time Job
          </h1>
          <p className="text-gray-600 mt-2 ml-10">
            Create a professional job posting to attract the best talent for your organization.
          </p>
        </div>

        {/* Main Form Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Job Basic Info Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <AiOutlineFileText className="text-blue-500 mr-2" />
                  Job Title*
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Senior Software Engineer"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MdOutlineWork className="text-blue-500 mr-2" />
                  Required Skills*
                </label>
                <input
                  type="text"
                  value={skills.join(", ")}
                  onChange={(e) => setSkills(e.target.value.split(",").map((skill) => skill.trim()))}
                  placeholder="e.g., React, Node.js, TypeScript"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-colors"
                />
                <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <HiOutlineOfficeBuilding className="text-blue-500 mr-2" />
                    Work Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-colors"
                  >
                    <option value="virtual">Virtual</option>
                    <option value="in-person">In-Person</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <MdOutlineBusinessCenter className="text-blue-500 mr-2" />
                    Employment
                  </label>
                  <select
                    value={jobPartFull}
                    onChange={(e) => setJobPartFull(e.target.value as "part" | "full")}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-colors"
                  >
                    <option value="part">Part-Time</option>
                    <option value="full">Full-Time</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Job Details Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Job Details</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <AiOutlineNumber className="text-blue-500 mr-2" />
                    Positions
                  </label>
                  <input
                    type="number"
                    value={numPosition}
                    onChange={(e) => setNumPosition(e.target.value ? Number(e.target.value) : "")}
                    placeholder="e.g., 5"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <MdOutlineWork className="text-blue-500 mr-2" />
                    Min. Experience
                  </label>
                  <input
                    type="number"
                    value={minExperience}
                    onChange={(e) => setMinExperience(e.target.value ? Number(e.target.value) : "")}
                    placeholder="Years"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <AiOutlineDollarCircle className="text-blue-500 mr-2" />
                    Min. Salary*
                  </label>
                  <input
                    type="number"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value ? Number(e.target.value) : "")}
                    placeholder="Min ₹200,000"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <AiOutlineDollarCircle className="text-blue-500 mr-2" />
                    Max. Salary
                  </label>
                  <input
                    type="number"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value ? Number(e.target.value) : "")}
                    placeholder="e.g., ₹500,000"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaRegBuilding className="text-blue-500 mr-2" />
                  Organization*
                </label>
                <select
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value as "pv" | "sa")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-colors"
                >
                  <option value="">Select an Organization</option>
                  <option value="pv">PV</option>
                  <option value="sa">SA</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 border-t pt-6 flex justify-end space-x-4">
            <button
              onClick={() => {
                setTitle("");
                setSkills([]);
                setType("virtual");
                setJobPartFull("full");
                setNumPosition("");
                setMinExperience("");
                setMinSalary("");
                setMaxSalary("");
                setOrganization("");
              }}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition"
            >
              Reset Form
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
            >
              <MdOutlineBusinessCenter className="mr-2" />
              Post Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostFullTimeJobPage;
