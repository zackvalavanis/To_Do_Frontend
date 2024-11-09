import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(); // Rename to UserContext

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  const getUserData = async () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
      try {
        const response = await axios.get("http://localhost:3000/users/current.json");
        setCurrentUser(response.data);
        setIsLoggedIn(true);
      } catch (error) {
        console.error(error);
        setIsLoggedIn(false);
        setError("Failed to fetch user data. Please try again.");
      } finally {
        setLoading(false); // End loading when the request is done
      }
    } else {
      setLoading(false); // End loading if no JWT is found
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const login = (userData) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoggedIn, setCurrentUser, setIsLoggedIn, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
