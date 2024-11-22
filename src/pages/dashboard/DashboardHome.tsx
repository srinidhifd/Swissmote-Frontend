import { useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaEnvelope,
  FaUser,
  FaClipboardList,
  FaBullhorn,
  FaTasks
} from "react-icons/fa";

const DashboardHome = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-4xl font-extrabold text-gray-900">Welcome to the Swissmote Dashboard</h1>
      <p className="text-gray-700 mt-4 text-lg">
        Navigate through the dashboard to manage job listings, assignments, messages, and candidate-related activities.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Job Management Widget */}
        <div
          className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4 hover:shadow-lg transition cursor-pointer"
          onClick={() => navigate("/dashboard/job-management/full-time")}
        >
          <div className="bg-blue-100 text-blue-500 rounded-full p-3">
            <FaBriefcase className="text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Job Management</h2>
            <p className="text-sm text-gray-600 mt-2">
              Post, manage, and oversee job listings.
            </p>
          </div>
        </div>

        {/* Listings Widget */}
        <div
          className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4 hover:shadow-lg transition cursor-pointer"
          onClick={() => navigate("/dashboard/listings/active")}
        >
          <div className="bg-yellow-100 text-yellow-500 rounded-full p-3">
            <FaClipboardList className="text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Listings</h2>
            <p className="text-sm text-gray-600 mt-2">
              Access active, closed, and automated listings.
            </p>
          </div>
        </div>

        {/* Assignments Widget */}
        <div
          className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4 hover:shadow-lg transition cursor-pointer"
          onClick={() => navigate("/dashboard/assignments/get")}
        >
          <div className="bg-red-100 text-red-500 rounded-full p-3">
            <FaTasks className="text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Assignments</h2>
            <p className="text-sm text-gray-600 mt-2">
              Manage and track assignments.
            </p>
          </div>
        </div>

        {/* Messaging Widget */}
        <div
          className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4 hover:shadow-lg transition cursor-pointer"
          onClick={() => navigate("/dashboard/messaging/messages")}
        >
          <div className="bg-green-100 text-green-500 rounded-full p-3">
            <FaEnvelope className="text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Messaging</h2>
            <p className="text-sm text-gray-600 mt-2">
              Send and view system messages.
            </p>
          </div>
        </div>

        {/* Announcements Widget */}
        <div
          className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4 hover:shadow-lg transition cursor-pointer"
          onClick={() => navigate("/dashboard/messaging/announcement")}
        >
          <div className="bg-indigo-100 text-indigo-500 rounded-full p-3">
            <FaBullhorn className="text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Announcements</h2>
            <p className="text-sm text-gray-600 mt-2">
              Create and view announcements.
            </p>
          </div>
        </div>

        {/* Candidate Management Widget */}
        <div
          className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4 hover:shadow-lg transition cursor-pointer"
          onClick={() => navigate("/dashboard/candidate-management/email")}
        >
          <div className="bg-purple-100 text-purple-500 rounded-full p-3">
            <FaUser className="text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Candidate Management</h2>
            <p className="text-sm text-gray-600 mt-2">
              Manage candidate profiles and email details.
            </p>
          </div>
        </div>


        
      </div>
    </div>
  );
};

export default DashboardHome;
