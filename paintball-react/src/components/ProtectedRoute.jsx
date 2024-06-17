import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../customer/Auth";

const ProtectedRoute = ({ allowedRoles }) => {
  const { userId, role } = useContext(AuthContext);

  if (!userId) {
    return <Navigate to="/admin" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
