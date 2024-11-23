import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const authToken = localStorage.getItem("authToken");

  // If user is not authenticated, redirect to Signin page
  if (!authToken) {
    return <Navigate to="/signin" />;
  }

  // If authenticated, allow access to the child component
  return <>{children}</>;
};

export default PrivateRoute;
