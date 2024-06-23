import React, { useContext } from "react";
import { Route, Navigate } from "react-router-dom";
import { AuthContext } from "./Auth";

const CustomerRoute = ({ element: Element, ...rest }) => {
  const { authenticatedUser } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      element={
        authenticatedUser && authenticatedUser.role === "customer" ? (
          <Element />
        ) : (
          <Navigate to="/signin" replace state={{ from: rest.location }} />
        )
      }
    />
  );
};

export default CustomerRoute;
