import { useState } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";
import {
  FaBriefcase,
  FaTasks,
  FaBullhorn,
  FaEnvelope,
  FaCog,
  FaHome,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaUser,
  FaComments, // Added icon for Chat
} from "react-icons/fa"; // Use the Sidebar component

const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State for sidebar toggle
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarCollapsed ? "w-20" : "w-64"
        } bg-black text-white flex flex-col p-4 transition-all duration-300`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2
            className={`text-2xl font-bold cursor-pointer ${
              isSidebarCollapsed ? "hidden" : "block"
            }`}
            onClick={() => navigate("/dashboard")}
          >
            Swissmote Dashboard
          </h2>
          <button
            className="text-white focus:outline-none"
            onClick={toggleSidebar}
          >
            {isSidebarCollapsed ? (
              <FaAngleDoubleRight className="text-xl" />
            ) : (
              <FaAngleDoubleLeft className="text-xl" />
            )}
          </button>
        </div>
        <nav className="flex flex-col space-y-4">
          <NavLink
            to="/dashboard/job-listings"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "text-gray-300"
            }
          >
            <FaBriefcase className="inline mr-2" />{" "}
            {!isSidebarCollapsed && "Job Listings"}
          </NavLink>
          <NavLink
            to="/dashboard/assignments"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "text-gray-300"
            }
          >
            <FaTasks className="inline mr-2" />{" "}
            {!isSidebarCollapsed && "Assignments"}
          </NavLink>
          <NavLink
            to="/dashboard/announcements"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "text-gray-300"
            }
          >
            <FaBullhorn className="inline mr-2" />{" "}
            {!isSidebarCollapsed && "Announcements"}
          </NavLink>
          <NavLink
            to="/dashboard/messages"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "text-gray-300"
            }
          >
            <FaEnvelope className="inline mr-2" />{" "}
            {!isSidebarCollapsed && "Messages"}
          </NavLink>
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "text-gray-300"
            }
          >
            <FaCog className="inline mr-2" />{" "}
            {!isSidebarCollapsed && "Settings"}
          </NavLink>
          <NavLink
            to="/dashboard/candidate-email"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "text-gray-300"
            }
          >
            <FaUser className="inline mr-2" />{" "}
            {!isSidebarCollapsed && "Candidate Email"}
          </NavLink>
          <NavLink
            to="/dashboard/get-updates"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "text-gray-300"
            }
          >
            <FaTasks className="inline mr-2" />{" "}
            {!isSidebarCollapsed && "Daily Updates"}
          </NavLink>
          <NavLink
            to="/dashboard/get-questions"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "text-gray-300"
            }
          >
            <FaTasks className="inline mr-2" />{" "}
            {!isSidebarCollapsed && "Questions"}
          </NavLink>
          <NavLink
            to="/dashboard/chat"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "text-gray-300"
            }
          >
            <FaComments className="inline mr-2" />{" "}
            {!isSidebarCollapsed && "Chat"}
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "text-gray-300"
            }
          >
            <FaHome className="inline mr-2" />{" "}
            {!isSidebarCollapsed && "Home"}
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
