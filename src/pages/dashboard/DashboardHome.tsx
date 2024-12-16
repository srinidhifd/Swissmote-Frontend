import {
  FaBriefcase,
  FaEnvelope,
  FaClipboardList,
  FaTasks,
  FaUserTie,
  FaChartBar,
} from "react-icons/fa";

const DashboardHome = () => {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-extrabold text-gray-900">Welcome to the Swissmote Dashboard</h1>
      <p className="text-gray-700 mt-4 text-lg">
        Explore tools to manage jobs, listings, messaging, and more with ease.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {/* Job Management Widget */}
        <div
          className="bg-gradient-to-r from-blue-100 to-blue-200 shadow-md rounded-lg p-6 flex items-center space-x-4 hover:shadow-xl hover:scale-105 transition transform cursor-pointer"
        >
          <div className="bg-blue-500 text-white rounded-full p-4">
            <FaBriefcase className="text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Job Management</h2>
            <p className="text-sm text-gray-600 mt-2">
              Post, manage, and oversee job opportunities.
            </p>
          </div>
        </div>

        {/* Listings Widget */}
        <div
          className="bg-gradient-to-r from-yellow-100 to-yellow-200 shadow-md rounded-lg p-6 flex items-center space-x-4 hover:shadow-xl hover:scale-105 transition transform cursor-pointer"
        >
          <div className="bg-yellow-500 text-white rounded-full p-4">
            <FaClipboardList className="text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Listings</h2>
            <p className="text-sm text-gray-600 mt-2">
              View and manage active and automated listings.
            </p>
          </div>
        </div>

        {/* Assignments Widget */}
        <div
          className="bg-gradient-to-r from-red-100 to-red-200 shadow-md rounded-lg p-6 flex items-center space-x-4 hover:shadow-xl hover:scale-105 transition transform cursor-pointer"
        >
          <div className="bg-red-500 text-white rounded-full p-4">
            <FaTasks className="text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Assignments</h2>
            <p className="text-sm text-gray-600 mt-2">
              Track and manage assignment processes.
            </p>
          </div>
        </div>

        {/* Messaging Widget */}
        <div
          className="bg-gradient-to-r from-green-100 to-green-200 shadow-md rounded-lg p-6 flex items-center space-x-4 hover:shadow-xl hover:scale-105 transition transform cursor-pointer"
        >
          <div className="bg-green-500 text-white rounded-full p-4">
            <FaEnvelope className="text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Messaging</h2>
            <p className="text-sm text-gray-600 mt-2">
              Send and view system messages.
            </p>
          </div>
        </div>

        {/* Evaluation Widget */}
        <div
          className="bg-gradient-to-r from-purple-100 to-purple-200 shadow-md rounded-lg p-6 flex items-center space-x-4 hover:shadow-xl hover:scale-105 transition transform cursor-pointer"
        >
          <div className="bg-purple-500 text-white rounded-full p-4">
            <FaChartBar className="text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Evaluation</h2>
            <p className="text-sm text-gray-600 mt-2">
              Evaluate performance and manage reports.
            </p>
          </div>
        </div>

        {/* Candidate Management Widget */}
        <div
          className="bg-gradient-to-r from-indigo-100 to-indigo-200 shadow-md rounded-lg p-6 flex items-center space-x-4 hover:shadow-xl hover:scale-105 transition transform cursor-pointer"
        >
          <div className="bg-indigo-500 text-white rounded-full p-4">
            <FaUserTie className="text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Candidate Management</h2>
            <p className="text-sm text-gray-600 mt-2">
              Oversee candidate profiles and automate replies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
