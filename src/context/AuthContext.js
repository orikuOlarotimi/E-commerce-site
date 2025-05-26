// src/context/AuthContext.js
import React, { useContext, createContext, useState, useEffect } from 'react';
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast } from "react-toastify";

export const  AuthContext = React.createContext({})


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cookies, removeCookie] = useCookies([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        setUser(null);  // Clear user if no token
        setLoading(false);
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
          const fullUserRes = await axios.get(`http://localhost:5000/api/users/user/${user._id}`);
          console.log(fullUserRes)
          setUser(fullUserRes.data);
          toast(`Welcome ${fullUserRes.data.username}`, { position: "top-right" });
        } else {
          removeCookie("token");
          setUser(null);
        }
      } catch (error) {
        removeCookie("token");
        setUser(null);
      }
      finally {
        setLoading(false);
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
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
    {!loading ? children : <div>Checking login status...</div>}
    </AuthContext.Provider>
  );
};

