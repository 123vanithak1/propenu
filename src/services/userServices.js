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
        throw Error("Failed to fetch shortlisted", error);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error :", error);
    }
  },

  postShortlistedProperties: async (payload) => {
    console.log("Payload :", payload);
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
      if (!response.ok) {
        throw Error("Failed to post shortlisted", error);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.log("Error :", error);
    }
  },

  getMyProperties: async () => {
    const token = await getToken();
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
      if (!response.ok) {
        throw Error("Failed to fetch Properties", error);
      }
      const data = await response.json();

      return data;
    } catch (error) {
      console.log("Error :", error);
    }
  },
  getContactedProperties: async () => {
    const token = await getToken();
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
      if (!response.ok) {
        throw Error("Failed to fetch contacted", error);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error :", error);
    }
  },

  getProjectLeads: async (projectId) => {
    const token = await getToken();
    try {
      if (!token) {
        console.log("No token found");
        return null;
      }
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.SHORTLIST.LEADS}?projectId=${projectId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // const response = await fetch(
      //   `${ENV.BASE_URL}${API_ROUTES.SHORTLIST.LEADS}`,
      //   {
      //     params: { projectId },
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //     },
      //   },
      // );
      if (!response.ok) {
        throw Error("Error when getting enquiries");
      }

      return response.json();
    } catch (error) {
      console.log(
        "GET PROJECT LEADS ERROR:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
};
