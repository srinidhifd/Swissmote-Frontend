import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    // Not logged in, redirect to signin page
    return <Navigate to="/signin" />;
  }

  // Logged in, render the requested route
  return children;
};

export default PrivateRoute;
