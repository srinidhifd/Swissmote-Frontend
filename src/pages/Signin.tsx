import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailSpin } from "react-loader-spinner";

const apiUrl = import.meta.env.VITE_API_URL;

const SigninPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect already logged-in users
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/api/auth/signin`, formData);
      if (response.status === 200) {
        const token = response.data.token;

        // Save the token in localStorage
        localStorage.setItem("authToken", token);

        // Show success notification
        toast.success("Signin successful!", {
          position: "top-right",
          autoClose: 2000,
        });

        // Navigate to dashboard immediately
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to sign in. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100vh] relative w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <TailSpin height="80" width="80" color="#4fa94d" ariaLabel="loading" />
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />

      {/* Back to Home Button */}
      <button
        onClick={() => navigate("/home")}
        className="absolute top-4 left-4 px-4 py-2 bg-gray-700 text-white rounded-md shadow hover:bg-gray-600 transition"
      >
        Back to Home
      </button>

      {/* Signin Form */}
      <div className="relative z-20 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">Sign In</h1>
        <form onSubmit={handleSignin} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-300 font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="p-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-400"
              required
            />
          </div>
          <div className="flex flex-col relative">
            <label htmlFor="password" className="text-gray-300 font-semibold mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-400 pr-12"
                required
              />
              <div
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-bold rounded-md shadow hover:bg-blue-600 transition-transform transform hover:scale-105"
          >
            Sign In
          </button>
        </form>
        <p className="text-gray-300 mt-6 text-center">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SigninPage;
