import { ENV } from "../../config";
import { API_ROUTES } from "./apiRoutes";
import * as Keychain from "react-native-keychain";

const getToken = async () => {
  const credentials = await Keychain.getGenericPassword();

  if (!credentials) {
    console.log("No token found in keychain");
    return;
  }

  const token = credentials.password;
  return token;
};

export const userServices = {
  getShortlistedProperties: async () => {
    const token = await getToken();
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.SHORTLIST.SHORTLISTED_PROP}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        console.log("Failed to fetch shortlisted", error);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  postShortlistedProperties: async (payload) => {
    console.log("Payload :", payload)
    const token = await getToken();
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.SHORTLIST.SHORTLISTED_PROP}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();
      console.log("DATA IN POST SHORTLIST :", data);

      return data;
    } catch (error) {
      throw error;
    }
  },

  getMyProperties: async (token) => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.SHORTLIST.MY_PROPERTIES}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      return {
        status: response.status,
        data,
      };
    } catch (error) {
      throw error;
    }
  },
  getContactedProperties: async (token) => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.SHORTLIST.CONTACTED_PROP}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      return {
        status: response.status,
        data,
      };
    } catch (error) {
      throw error;
    }
  },
};
