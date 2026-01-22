import { ENV } from "../../config";
import { API_ROUTES } from "./apiRoutes";

export const userServices = {
  getShortlistedProperties: async (token) => {
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

      const data = await response.json();
      return {
        status: response.status,
        data,
      };
    } catch (error) {
      throw error;
    }
  },

    postShortlistedProperties: async (payload) => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.SHORTLIST.SHORTLISTED_PROP}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
           body: JSON.stringify(payload),
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
};
