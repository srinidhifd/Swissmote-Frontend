import { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FaSignOutAlt, FaAngleLeft, FaAngleRight, FaBriefcase, FaBuilding, FaUserTie, FaGraduationCap, FaClipboardList, FaListAlt, FaRegClock, FaArchive, FaTasks, FaFileAlt, FaQuestionCircle, FaComments } from "react-icons/fa";

const DashboardLayout = () => {
  useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    navigate("/signin");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleDropdownClick = (category: string) => {
    setActiveDropdown(prev => prev === category ? null : category);
  };

  const menuItems = [
    {
      label: "Post Jobs",
      subItems: [
        { label: "Post Full-time Job", to: "/dashboard/job-management/full-time" },
        { label: "Post Internship", to: "/dashboard/job-management/internship" },
        { label: "Post Unpaid Internship", to: "/dashboard/job-management/unpaid-internship" },
      ],
    },
    {
      label: "Job Listings",
      subItems: [
        { label: "Auto Listings", to: "/dashboard/listings/auto" },
        { label: "Active Listings", to: "/dashboard/listings/active" },
        { label: "Closed Listings", to: "/dashboard/listings/closed" },
      ],
    },
    {
      label: "Assignments",
      subItems: [
        { label: "Get Assignments", to: "/dashboard/assignments" },
      ],
    },
    {
      label: "Questions",
      subItems: [
        { label: "View Questions", to: "/dashboard/questions" },
      ],
    },
  ];

  const menuIcons = {
    "Post Jobs": <FaBriefcase />,
    "Job Listings": <FaListAlt />,
    "Assignments": <FaClipboardList />,
    "Post Full-time Job": <FaBuilding />,
    "Post Internship": <FaGraduationCap />,
    "Post Unpaid Internship": <FaUserTie />,
    "Auto Listings": <FaRegClock />,
    "Active Listings": <FaTasks />,
    "Closed Listings": <FaArchive />,
    "Get Assignments": <FaFileAlt />,
    "Questions": <FaQuestionCircle />,
    "View Questions": <FaComments />
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-30 bg-black text-white transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-[20%] md:w-[20%]' : 'w-[10%] md:w-[5%]'
        }`}
      >
        {/* Sidebar Header */}
        <div 
          className="flex items-center justify-between h-16 px-4 border-b border-gray-700 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          {isSidebarOpen ? (
            <div className="text-xl font-bold">Swissmote Dashboard</div>
          ) : (
            <div className="text-sm font-bold">SM</div>
          )}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleSidebar();
            }}
            className="p-2 rounded-lg hover:bg-gray-700 focus:outline-none"
          >
            <FaAngleLeft className={`transition-transform duration-300 ${!isSidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="py-4 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.label} className="px-4 py-2 relative group">
              <button
                data-label={item.label}
                onClick={() => handleDropdownClick(item.label)}
                className="flex items-center justify-between w-full text-left hover:bg-gray-700 rounded-lg px-3 py-2"
              >
                <span className="flex items-center gap-3">
                  {menuIcons[item.label as keyof typeof menuIcons]}
                  {isSidebarOpen && item.label}
                </span>
                {isSidebarOpen && item.subItems && (
                  <FaAngleRight
                    className={`transition-transform ${
                      activeDropdown === item.label ? 'rotate-90' : ''
                    }`}
                  />
                )}
              </button>
              {activeDropdown === item.label && (
                <div 
                  className={`${
                    isSidebarOpen 
                      ? 'mt-2 ml-4 space-y-2' 
                      : 'fixed left-[10%] md:left-[5%] min-w-[200px] bg-black rounded-lg p-2 shadow-lg z-50'
                  }`}
                  style={{ 
                    top: !isSidebarOpen ? 
                      (sidebarRef.current?.querySelector(`[data-label="${item.label}"]`)?.getBoundingClientRect().top || 0) + 'px'
                      : 'auto'
                  }}
                >
                  {item.subItems?.map((subItem) => (
                    <NavLink
                      key={subItem.label}
                      to={subItem.to}
                      onClick={() => setActiveDropdown(null)}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-700'
                        }`
                      }
                    >
                      {menuIcons[subItem.label as keyof typeof menuIcons]}
                      <span>{subItem.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 w-full border-t border-gray-700 p-4">
          {isSidebarOpen && (
            <div className="mb-2 text-sm">
              Welcome, <span className="font-bold">{userName}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-red-400 hover:text-red-300 w-full"
          >
            <FaSignOutAlt />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarOpen ? 'ml-[80%] md:ml-[20%]' : 'ml-[10%] md:ml-[5%]'
      }`}>
        <main className="max-w-[94vw]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
