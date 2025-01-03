import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full px-8 py-4 flex justify-between items-center backdrop-blur-md bg-white/4 border-b border-white/20 z-50 shadow-lg">
      <div className="text-2xl font-bold text-white hover:cursor-pointer">
        <a href="/home">Swissmote</a>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-6">
        <a href="#how-it-works" className="text-white hover:text-gray-300">
          Process
        </a>
        <a href="#features" className="text-white hover:text-gray-300">
          Features
        </a>
        <a href="#testimonials" className="text-white hover:text-gray-300">
          Testimonials
        </a>
        <a href="#contact" className="text-white hover:text-gray-300">
          Contact
        </a>
        <a href="/dashboard" className="text-white hover:text-gray-300">
          Dashboard
        </a>
      </div>

      {/* Desktop Buttons */}
      <div className="hidden md:flex space-x-4">
        
        <button
          onClick={() => navigate("/signup")}
          className="px-4 py-2 bg-white text-black font-semibold rounded-md shadow hover:bg-gray-200 transition"
        >
          Sign Up
        </button>
        <button
          onClick={() => navigate("/signin")}
          className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-md shadow hover:bg-gray-600 transition"
        >
          Sign In
        </button>
      </div>

      {/* Mobile Menu Icon */}
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-white focus:outline-none">
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-primary backdrop-blur-md border-t border-white/20 shadow-lg md:hidden">
          <div className="flex flex-col items-center py-4 space-y-4">
            <a href="#how-it-works" className="text-white hover:text-gray-300" onClick={toggleMenu}>
              Process
            </a>
            <a href="#features" className="text-white hover:text-gray-300" onClick={toggleMenu}>
              Features
            </a>
            <a href="#testimonials" className="text-white hover:text-gray-300" onClick={toggleMenu}>
              Testimonials
            </a>
            <a href="#contact" className="text-white hover:text-gray-300" onClick={toggleMenu}>
              Contact
            </a>
            <a href="/dashboard" className="text-white hover:text-gray-300" onClick={toggleMenu}>
              Dashboard
            </a>
            <button
              onClick={() => {
                navigate("/signup");
                toggleMenu();
              }}
              className=" px-4 py-2 bg-white text-black font-semibold rounded-md shadow hover:bg-gray-200 transition"
            >
              Sign Up
            </button>
            <button
              onClick={() => {
                navigate("/signin");
                toggleMenu();
              }}
              className=" px-4 py-2 bg-gray-700 text-white font-semibold rounded-md shadow hover:bg-gray-700 transition"
            >
              Sign In
            </button>
            
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
