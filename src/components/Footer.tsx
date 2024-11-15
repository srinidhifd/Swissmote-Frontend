import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="py-12 bg-black text-gray-400">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 px-4">
        
        {/* Brand Section */}
        <div className="text-center md:text-left">
          <h2 className="font-bold text-white text-2xl">Swissmote</h2>
          <p className="text-gray-500 mt-2">
            Connecting job seekers with unique hiring processes.
          </p>
        </div>
        
        {/* Quick Links Section */}
        <div className="text-center md:text-left">
          <h2 className="font-bold text-white text-2xl">Quick Links</h2>
          <ul className="space-y-2 mt-2">
            <li><a href="#features" className="hover:text-white">Features</a></li>
            <li><a href="#how-it-works" className="hover:text-white">Process</a></li>
            <li><a href="#contact" className="hover:text-white">Contact</a></li>
            <li><a href="#privacy" className="hover:text-white">Privacy Policy</a></li>
          </ul>
        </div>
        
        {/* Stay Connected Section */}
        <div className="text-center md:text-left">
          <h2 className="font-bold text-white text-2xl">Stay Connected</h2>
          <form className="mt-4 flex justify-center md:justify-start">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-2 rounded-l bg-secondary text-white focus:outline-none w-2/3"
            />
            <button className="bg-white text-black px-4 py-2 rounded-r hover:bg-gray-400 transition">
              Subscribe
            </button>
          </form>
        </div>
        
        {/* Social Media Section */}
        <div className="text-center md:text-left">
          <h2 className="font-bold text-white text-2xl">Follow Us</h2>
          <div className="flex justify-center md:justify-start space-x-4 mt-4 text-gray-500">
            <a href="https://facebook.com" className="hover:text-white" aria-label="Facebook">
              <FaFacebook size={24} />
            </a>
            <a href="https://twitter.com" className="hover:text-white" aria-label="Twitter">
              <FaTwitter size={24} />
            </a>
            <a href="https://linkedin.com" className="hover:text-white" aria-label="LinkedIn">
              <FaLinkedin size={24} />
            </a>
            <a href="https://instagram.com" className="hover:text-white" aria-label="Instagram">
              <FaInstagram size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <p className="mt-8 text-center text-sm text-gray-500 font-semibold text-gray-600 text-lg">
        © 2024 Swissmote. All rights reserved.
      </p>
    </footer>
  );
}
