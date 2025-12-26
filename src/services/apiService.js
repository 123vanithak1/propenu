import { ENV } from "../../config";
import { API_ROUTES } from "./apiRoutes";

export const apiService = {
  login: async (payload) => {
    try {
      const response = await fetch(`${ENV.BASE_URL}${API_ROUTES.AUTH.LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      return {
        status: response.status,
        data,
      };
    } catch (error) {
      throw error;
    }
  },
  verifyOtp: async (payload) => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.AUTH.VERIFY_OTP}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
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

  verifyToken: async (token) => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.AUTH.VERIFY_TOKEN}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
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
  
  featuredProjects: async () => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.USER.FEATURED_PROJECTS}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
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

  HighlightProjects: async () => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.USER.HIGHLIGHT_PROJECTS}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
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
  ownersProperties: async () => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.USER.OWNERS_PROPERTIES}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
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
