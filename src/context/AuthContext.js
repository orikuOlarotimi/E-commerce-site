// src/context/AuthContext.js
import React, { useContext, createContext, useState, useEffect } from 'react';
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast } from "react-toastify";

export const  AuthContext = React.createContext({})


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cookies, removeCookie] = useCookies([]);

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        setUser(null);  // Clear user if no token
        return;
      }
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/users/auth-status",
          {},
          { withCredentials: true }
        );
        const { status, user } = data;
        if (status) {
          setUser(user);
          toast(`Hello ${user}`, { position: "top-right" });
        } else {
          removeCookie("token");
          setUser(null);
        }
      } catch (error) {
        removeCookie("token");
        setUser(null);
      }
    };
    verifyCookie();
  }, [cookies, removeCookie]);

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/logout", {}, {
        withCredentials: true, // include cookies
      });
  
      removeCookie("token"); // cleanup on client
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // expose setUser so components can update user (e.g., on login)
  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

