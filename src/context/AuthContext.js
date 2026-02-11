import React, { createContext, useContext, useEffect, useState } from "react";
import * as Keychain from "react-native-keychain";
import { getItem,setItem } from "../utils/Storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  const refreshAuth = async () => {
    try {
      setIsChecking(true);
      const credentials = await Keychain.getGenericPassword();
      const data = await getItem("user");
      const userData = JSON.parse(data);

      setIsLoggedIn(!!credentials?.password);
      setUserDetails(userData);
    } catch (e) {
      console.log("Auth refresh error", e);
      setIsLoggedIn(false);
    } finally {
      setIsChecking(false);
    }
  };

const updateUserDetails = async (newData) => {
  try {
    const updatedUser = { ...userDetails, ...newData };

    setUserDetails(updatedUser); // update UI immediately

    await setItem("user", JSON.stringify(updatedUser)); // ⭐ persist
  } catch (e) {
    console.log("Update user error:", e);
  }
};

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isChecking,
        userDetails,
        refreshAuth,
        updateUserDetails, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
