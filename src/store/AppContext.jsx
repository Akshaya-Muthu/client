import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  axios.defaults.withCredentials = true;

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "https://password-reset-backend-91o4.onrender.com";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);  // new loading state
  
  const handleError = (error) => {
    console.error("Error:", error.response || error);
    toast.error(error.response?.data?.message || "An error occurred.");
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/user/data`);
      if (data.success) {
        setUserData(data.userData);
      } else {
        handleError(data);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/auth/is-auth`);
      if (data.success) {
        setIsLoggedIn(true);
        await getUserData();
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.warn("Auth check failed:", error.response?.data || error.message);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);  // set loading to false regardless of success or failure
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendURL,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    isLoading,  // provide loading state to context
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
