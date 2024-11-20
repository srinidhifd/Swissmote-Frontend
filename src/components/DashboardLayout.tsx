// src/components/DashboardLayout.tsx

import { NavLink, Outlet } from "react-router-dom";
import { FaBriefcase, FaTasks, FaBullhorn, FaEnvelope, FaCog, FaHome } from "react-icons/fa";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col p-4">
        <h2 className="text-2xl font-bold mb-8">Swissmote Dashboard</h2>
        <nav className="flex flex-col space-y-4">
          <NavLink
            to="/dashboard/job-listings"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "text-gray-300"
            }
          >
            <FaBriefcase className="inline mr-2" /> Job Listings
          </NavLink>
          <NavLink
            to="/dashboard/assignments"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "text-gray-300"
            }
          >
            <FaTasks className="inline mr-2" /> Assignments
          </NavLink>
          <NavLink
            to="/dashboard/announcements"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "text-gray-300"
            }
          >
            <FaBullhorn className="inline mr-2" /> Announcements
          </NavLink>
          <NavLink
            to="/dashboard/messages"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "text-gray-300"
            }
          >
            <FaEnvelope className="inline mr-2" /> Messages
          </NavLink>
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "text-gray-300"
            }
          >
            <FaCog className="inline mr-2" /> Settings
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-blue-400" : "text-gray-300"
            }
          >
            <FaHome className="inline mr-2" /> Home
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
