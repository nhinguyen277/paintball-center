import React, { useContext } from "react";
import { Route, Navigate } from "react-router-dom";
import { AuthContext } from "./Auth";

const AdminRoute = ({ element: Element, ...rest }) => {
  const { authenticatedUser } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      element={
        authenticatedUser && authenticatedUser.role === "admin" ? (
          <Element />
        ) : (
          <Navigate to="/admin" replace state={{ from: rest.location }} />
        )
      }
    />
  );
};

export default AdminRoute;
