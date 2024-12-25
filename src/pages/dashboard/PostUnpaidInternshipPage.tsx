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
    <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <TailSpin height="50" width="50" color="#4fa94d" ariaLabel="loading" />
            <p className="text-gray-600 mt-2">Posting internship...</p>
          </div>
        </div>
      )}

      <ToastContainer />

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <MdOutlineBusinessCenter className="text-blue-500 mr-3 text-4xl" />
            Post Unpaid Internship
          </h1>
          <p className="text-gray-600 mt-2 ml-10">
            Create a new unpaid internship opportunity to attract talented individuals.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <AiOutlineFileText className="text-blue-500 mr-2" />
                  Internship Title*
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Software Development Intern"
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

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Internship Details</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <AiOutlineNumber className="text-blue-500 mr-2" />
                    Positions*
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
                    <MdOutlineAccessTime className="text-blue-500 mr-2" />
                    Duration*
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value ? Number(e.target.value) : "")}
                    placeholder="Months"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">Important Note</h3>
                <p className="text-sm text-yellow-700">
                  This is an unpaid internship opportunity. Ensure candidates understand there is no monetary compensation,
                  but they will gain valuable experience and mentorship.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t pt-6 flex justify-end space-x-4">
            <button
              onClick={() => {
                setTitle("");
                setSkills([]);
                setType("virtual");
                setJobPartFull("part");
                setNumPosition("");
                setDuration("");
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
              Post Unpaid Internship
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostUnpaidInternshipPage;
