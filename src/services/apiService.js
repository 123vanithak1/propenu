import { ENV } from "../../config";
import { API_ROUTES } from "./apiRoutes";

export const apiService = {
  login: async (payload) => {
    console.log("API Service Login Payload:", payload);
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
    console.log("API Service Verify OTP Payload:", payload);
    try {
      const response = await fetch(`${ENV.BASE_URL}${API_ROUTES.AUTH.VERIFY_OTP}`, {
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
};
