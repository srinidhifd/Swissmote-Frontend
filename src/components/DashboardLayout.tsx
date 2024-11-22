import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
} from "react-icons/fa";

interface MenuItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: { label: string; to: string }[];
  to?: string;
}

const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null); // Tracks hovered category
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
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
        { label: "Automate Listings", to: "/dashboard/listings/automate" },
        { label: "Active Listings", to: "/dashboard/listings/active" },
        { label: "Closed Listings", to: "/dashboard/listings/closed" },
        { label: "Listing Status", to: "/dashboard/listings/status" },
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
    <div className="flex min-h-screen bg-gray-100 relative">
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

        <nav className="flex flex-col space-y-4 relative">
          {menuItems.map((item) => (
            <div
              key={item.label}
              className="relative group"
              onMouseEnter={() => setHoveredCategory(item.label)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <NavLink
                to={item.to || "#"}
                className="flex items-center space-x-2 text-gray-300 hover:text-gray-100 transition cursor-pointer"
              >
                <item.icon className="text-lg" />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </NavLink>

              {/* Subcategories */}
              {item.subItems && hoveredCategory === item.label && (
                <div
                  className="absolute top-0 left-full bg-black text-white p-4 rounded shadow-lg space-y-2 z-50"
                  style={{ minWidth: "200px" }}
                >
                  {item.subItems.map((subItem) => (
                    <NavLink
                      key={subItem.label}
                      to={subItem.to}
                      className="block text-sm hover:text-blue-400"
                    >
                      {subItem.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-white shadow-inner">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
