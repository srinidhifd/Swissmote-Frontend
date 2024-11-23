// src/hooks/useAuth.ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Custom Hook to verify if the user is authenticated
const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("Checking authToken:", token);
    if (!token) {
      // If no token found, redirect to the signin page
      navigate("/signin");
    }
  }, [navigate]);
};

export default useAuth;
