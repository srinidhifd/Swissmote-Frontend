import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FaSignOutAlt, FaBars, FaTimes, FaAngleDown } from "react-icons/fa";

interface MenuItem {
  label: string;
  subItems?: { label: string; to: string }[];
}

const DashboardLayout = () => {
  useAuth();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/signin");
  };

  const handleDropdownClick = (category: string) => {
    setActiveDropdown((prev) => (prev === category ? null : category));
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInsideMenu = target.closest(".mobile-menu, .dropdown, .hamburger-btn");
      
      if (!isInsideMenu) {
        closeDropdown();
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems: MenuItem[] = [
    {
      label: "Job Management",
      subItems: [
        { label: "Post Full-time Job", to: "/dashboard/job-management/full-time" },
        { label: "Post Internship", to: "/dashboard/job-management/internship" },
        { label: "Post Unpaid Internship", to: "/dashboard/job-management/unpaid-internship" },
      ],
    },
    {
      label: "Listings",
      subItems: [
        { label: "Auto Listings", to: "/dashboard/listings/auto" },
        { label: "Active Listings", to: "/dashboard/listings/active" },
        { label: "Closed Listings", to: "/dashboard/listings/closed" },
      ],
    },
    {
      label: "Reviews & Updates",
      subItems: [
        { label: "Daily Updates", to: "/dashboard/reviews/daily" },
        { label: "Reply to Daily Updates", to: "/dashboard/reviews/reply" },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="bg-black text-white shadow-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="text-xl font-bold tracking-wide cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            Swissmote
          </div>

          {/* Hamburger Icon */}
          <div className="sm:hidden">
            <button
              className="text-white text-2xl focus:outline-none hamburger-btn"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex space-x-10">
            {menuItems.map((item) => (
              <div
                key={item.label}
                className="relative dropdown"
                onClick={(e) => e.stopPropagation()} // Prevent click from closing the dropdown
              >
                <button
                  className="text-sm hover:text-gray-300 focus:outline-none flex items-center space-x-1"
                  onClick={() => handleDropdownClick(item.label)}
                >
                  <span>{item.label}</span>
                  {item.subItems && (
                    <FaAngleDown
                      className={`transition-transform transform ${
                        activeDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
                {/* Dropdown */}
                {item.subItems && activeDropdown === item.label && (
                  <div className="absolute left-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg z-50">
                    {item.subItems.map((subItem) => (
                      <NavLink
                        key={subItem.label}
                        to={subItem.to}
                        className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-lg"
                      >
                        {subItem.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="hidden sm:flex text-sm items-center space-x-1 text-red-500 hover:text-red-400"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="sm:hidden mobile-menu bg-black text-white"
            onClick={(e) => e.stopPropagation()} // Prevents menu from closing when clicking inside
          >
            <div className="flex flex-col space-y-4 p-4">
              {menuItems.map((item) => (
                <div key={item.label} className="relative dropdown">
                  <button
                    className="w-full text-left flex justify-between items-center text-sm"
                    onClick={() => handleDropdownClick(item.label)}
                  >
                    <span>{item.label}</span>
                    {item.subItems && (
                      <FaAngleDown
                        className={`transition-transform transform ${
                          activeDropdown === item.label ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                  {item.subItems && activeDropdown === item.label && (
                    <div className="mt-2 space-y-2 pl-4">
                      {item.subItems.map((subItem) => (
                        <NavLink
                          key={subItem.label}
                          to={subItem.to}
                          className="block text-sm hover:text-blue-300"
                        >
                          {subItem.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={handleLogout}
                className="text-sm flex items-center space-x-1 text-red-500 hover:text-red-400 mt-4"
              >
                <FaSignOutAlt className="text-lg" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-16 px-4 sm:px-6 lg:px-8 bg-white shadow-inner">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
