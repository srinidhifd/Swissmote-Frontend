import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import {
  FaBriefcase,
  FaClipboardList,
  FaEnvelope,
  // FaHome,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaUserTie,
  FaChartBar,
  FaCommentDots,
  FaSignOutAlt,
} from "react-icons/fa";

interface MenuItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: { label: string; to: string }[];
  to?: string;
}

const DashboardLayout = () => {
  useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null); // Tracks expanded category
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const handleCategoryClick = (category: string) => {
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/signin");
  };

  const menuItems: MenuItem[] = [
    {
      label: "Job Management",
      icon: FaBriefcase,
      subItems: [
        { label: "Post Full-time Job", to: "/dashboard/job-management/full-time" },
        { label: "Post Internship", to: "/dashboard/job-management/internship" },
        { label: "Post Unpaid Internship", to: "/dashboard/job-management/unpaid-internship" },
      ],
    },
    {
      label: "Listings",
      icon: FaClipboardList,
      subItems: [
        { label: "Auto Listings", to: "/dashboard/listings/auto" },
        { label: "Active Listings", to: "/dashboard/listings/active" },
        { label: "Closed Listings", to: "/dashboard/listings/closed" },
      ],
    },
    {
      label: "Messaging",
      icon: FaEnvelope,
      subItems: [
        { label: "Get Messages", to: "/dashboard/get-messages" },
        { label: "Send Message", to: "/dashboard/send-message" },
        { label: "Chat", to: "/dashboard/chat" },
      ],
    },
    {
      label: "Candidate Management",
      icon: FaUserTie,
      subItems: [
        { label: "Reply via Bot", to: "/dashboard/candidate-management/bot-reply" },
      ],
    },
    {
      label: "Evaluation",
      icon: FaChartBar,
      subItems: [
        { label: "Mark Bot Evaluation", to: "/dashboard/evaluation/bot-mark" },
      ],
    },
    {
      label: "Reviews & Updates",
      icon: FaCommentDots,
      subItems: [
        { label: "Daily Updates", to: "/dashboard/reviews/daily" },
        { label: "Reply to Daily Updates", to: "/dashboard/reviews/reply" },
      ],
    },
    // { label: "Home", icon: FaHome, to: "/" },
  ];

  return (
    <div className="flex min-h-screen bg-white relative">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarCollapsed ? "w-15" : "w-55"
        } bg-black text-white flex flex-col p-4 transition-all duration-300 ease-in-out shadow-lg`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2
            className={`text-2xl font-bold cursor-pointer whitespace-nowrap ${
              isSidebarCollapsed ? "hidden" : "block"
            }`}
            onClick={() => navigate("/dashboard")}
          >
            Swissmote
          </h2>
          <button
            className="text-white focus:outline-none"
            onClick={toggleSidebar}
            title="Toggle Sidebar"
          >
            {isSidebarCollapsed ? (
              <FaAngleDoubleRight className="text-xl hover:text-gray-400" />
            ) : (
              <FaAngleDoubleLeft className="text-xl hover:text-gray-400" />
            )}
          </button>
        </div>

        <nav className="flex flex-col space-y-4 flex-grow">
          {menuItems.map((item) => (
            <div key={item.label} className="relative">
              <div
                onClick={() => handleCategoryClick(item.label)}
                className="flex items-center space-x-2 text-gray-300 hover:text-gray-100 transition cursor-pointer"
              >
                <item.icon className="text-lg" />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </div>

              {/* Subcategories */}
              {item.subItems && expandedCategory === item.label && (
                <div className={`ml-8 mt-2 space-y-2 ${isSidebarCollapsed ? "hidden" : "block"}`}>
                  {item.subItems.map((subItem) => (
                    <NavLink
                      key={subItem.label}
                      to={subItem.to}
                      className="block text-sm text-gray-300 hover:text-blue-400"
                    >
                      {subItem.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-8 flex items-center space-x-2 text-red-500 hover:text-red-400 transition ml-2"
        >
          <FaSignOutAlt className="text-lg" />
          {!isSidebarCollapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-white shadow-inner">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
