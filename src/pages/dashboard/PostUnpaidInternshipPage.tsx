import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin } from "react-loader-spinner";
import { AiOutlineFileText, AiOutlineNumber } from "react-icons/ai";
import { MdOutlineWork, MdOutlineAccessTime, MdOutlineBusinessCenter } from "react-icons/md";
import { HiOutlineOfficeBuilding } from "react-icons/hi";

const PostUnpaidInternshipPage = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const authToken = import.meta.env.VITE_AUTH_TOKEN;

  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [type, setType] = useState("virtual");
  const [jobPartFull, setJobPartFull] = useState<"part" | "full">("part");
  const [numPosition, setNumPosition] = useState<number | "">("");
  const [duration, setDuration] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Internship Title is required.", { position: "top-right", autoClose: 3000 });
      return;
    }
    if (skills.length === 0) {
      toast.error("Please enter at least one skill.", { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!numPosition || numPosition <= 0) {
      toast.error("Please enter a valid number of positions.", { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!duration || duration <= 0) {
      toast.error("Please enter a valid duration.", { position: "top-right", autoClose: 3000 });
      return;
    }

    const unpaidInternshipData = {
      job_title: title,
      skills,
      job_type: type,
      job_part_full: jobPartFull,
      num_position: Number(numPosition),
      duration: Number(duration),
      post_on_linkedin: false,
    };

    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/unpaidArmy?dev=true`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(unpaidInternshipData),
      });

      if (!response.ok) {
        throw new Error("Failed to post the unpaid internship. Please try again.");
      }

      const data = await response.json();
      toast.success(data.message || "Unpaid internship posted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      setTitle("");
      setSkills([]);
      setType("virtual");
      setJobPartFull("part");
      setNumPosition("");
      setDuration("");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.", { position: "top-right", autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <TailSpin height="80" width="80" color="#4fa94d" ariaLabel="loading" />
        </div>
      )}

      <ToastContainer />

      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 flex items-center">
          <MdOutlineBusinessCenter className="text-blue-500 mr-3" />
          Post Unpaid Internship
        </h1>
        <p className="text-gray-600 mb-8">
          Create a new unpaid internship opportunity to attract talented individuals.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <AiOutlineFileText className="text-blue-500 mr-2" />
              Internship Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Software Development Intern"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <MdOutlineWork className="text-blue-500 mr-2" />
              Skills
            </label>
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
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <HiOutlineOfficeBuilding className="text-blue-500 mr-2" />
              Work Type
            </label>
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
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <MdOutlineWork className="text-blue-500 mr-2" />
              Employment Type
            </label>
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
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <AiOutlineNumber className="text-blue-500 mr-2" />
              Number of Positions
            </label>
            <input
              type="number"
              value={numPosition}
              onChange={(e) => setNumPosition(e.target.value ? Number(e.target.value) : "")}
              placeholder="e.g., 5"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <MdOutlineAccessTime className="text-blue-500 mr-2" />
              Duration (in months)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value ? Number(e.target.value) : "")}
              placeholder="e.g., 6"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleSave}
            className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Post Unpaid Internship
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostUnpaidInternshipPage;
