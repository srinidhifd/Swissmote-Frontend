import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import {
  FaBriefcase,
  FaClipboardList,
  FaEnvelope,
  FaHome,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaUserTie,
  FaChartBar,
  FaTasks,
  FaQuestion,
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
      label: "Assignments",
      icon: FaTasks,
      subItems: [
        { label: "View Assignments", to: "/dashboard/assignments/get" },
        { label: "Add Assignment", to: "/dashboard/assignments/add" },
      ],
    },
    {
      label: "Messaging",
      icon: FaEnvelope,
      subItems: [
        { label: "Announcements", to: "/dashboard/announcements" },
        { label: "Get Messages", to: "/dashboard/get-messages" },
        { label: "Send Message", to: "/dashboard/send-message" },
        { label: "Chat", to: "/dashboard/chat" },
      ],
    },
    {
      label: "Candidate Management",
      icon: FaUserTie,
      subItems: [
        { label: "Reply to Candidate", to: "/dashboard/candidate-management/reply" },
        { label: "Reply via Bot", to: "/dashboard/candidate-management/bot-reply" },
        { label: "Hire Candidate", to: "/dashboard/candidate-management/hire" },
        { label: "Email Candidates", to: "/dashboard/candidate-management/email" },
      ],
    },
    {
      label: "Evaluation",
      icon: FaChartBar,
      subItems: [
        { label: "Mark Evaluation", to: "/dashboard/evaluation/mark" },
        { label: "Mark Bot Evaluation", to: "/dashboard/evaluation/bot-mark" },
        { label: "Mark Future Evaluation", to: "/dashboard/evaluation/future-mark" },
      ],
    },
    {
      label: "Questions",
      icon: FaQuestion,
      subItems: [
        { label: "Get Questions", to: "/dashboard/questions/get" },
        { label: "Reply to Questions", to: "/dashboard/questions/reply" },
      ],
    },
    {
      label: "Reviews & Updates",
      icon: FaCommentDots,
      subItems: [
        { label: "Add Review", to: "/dashboard/reviews/add" },
        { label: "Daily Updates", to: "/dashboard/reviews/daily" },
        { label: "Reply to Daily Updates", to: "/dashboard/reviews/reply" },
      ],
    },
    { label: "Home", icon: FaHome, to: "/" },
  ];

  return (
    <div className="flex min-h-screen bg-white relative">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarCollapsed ? "w-20" : "w-64"
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
