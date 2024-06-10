import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [customerId, setCustomerId] = useState(null);

  const setAuthenticatedUser = (customerId) => {
    setCustomerId(customerId);
  };

  return (
    <AuthContext.Provider value={{ customerId, setAuthenticatedUser }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
