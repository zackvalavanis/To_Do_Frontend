// UserContext.js
import React, { createContext, useContext, useState } from 'react';

// Create a Context for the current user
const UserContext = createContext(null);

// Create a Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initial state is null until user is authenticated

  const login = (userData) => {
    setUser(userData); // Set user data when user logs in
  };

  const logout = () => {
    setUser(null); // Clear user data when user logs out
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a hook to easily access the context
export const useUser = () => useContext(UserContext);
