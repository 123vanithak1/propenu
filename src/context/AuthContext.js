import React, { createContext, useContext, useEffect, useState } from "react";
import * as Keychain from "react-native-keychain";
import { getItem, setItem } from "../utils/Storage";

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

      setUserDetails(updatedUser);

      await setItem("user", JSON.stringify(updatedUser));
    } catch (e) {
      console.log("Update user error:", e);
    }
  };

  /**
   * saveTokenAndRefresh — called after a successful DigiLocker KYC callback.
   *
   * The backend returns a brand-new JWT (with updated accountStatus / kyc data).
   * This helper:
   *  1. Saves the new token to Keychain (same key as login: "username"/"password")
   *  2. Decodes the JWT payload to extract user fields
   *  3. Persists user data to AsyncStorage so it survives app restarts
   *  4. Calls refreshAuth() to update React state
   *
   * Option B note: if we later switch to expo-web-browser deep-link flow,
   * this is the same function to call after parsing the deep-link URL params.
   */
  const saveTokenAndRefresh = async (newToken, kycUser) => {
    try {
      // 1. Persist new JWT to Keychain (same pattern as login)
      await Keychain.setGenericPassword("propenu_user", newToken);

      // 2. Merge updated KYC user data into existing userDetails
      if (kycUser) {
        const merged = { ...userDetails, ...kycUser };
        await setItem("user", JSON.stringify(merged));
        setUserDetails(merged);
      }

      // 3. Reload from storage to ensure consistency
      await refreshAuth();
    } catch (e) {
      console.log("saveTokenAndRefresh error:", e);
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
        saveTokenAndRefresh, // ← exposed for KYC WebView callback
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

