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

export const postPropertyServices = {
  getDraftId: async (category) => {
    const token = await getToken();

    try {
      const response = await fetch(
        `${ENV.BASE_URL}/api/properties/${category}/draft`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        throw await response.json();
      }

      return await response.json();
    } catch (error) {
      console.log("Error in getting draft ID:", error);
    }
  },

  BasicDetailsStep: async (category, id, step, data) => {
    const token = await getToken();

    try {
      const response = await fetch(
        `${ENV.BASE_URL}/api/properties/${category}/${id}/${step}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      console.log("verification completed and posted:", data);

      return await data;
    } catch (error) {
      console.log("Error in basic details step:", error);
    }
  },

  ProfileDetailsStep: async (category, id, formData) => {
    const token = await getToken();
    try {
      const response = await fetch(
        `${ENV.BASE_URL}/api/properties/${category}/${id}/details`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      console.log("verification completed and posted:", data);

      return await data;
    } catch (error) {
      console.log("Error in details step:", error);
    }
  },

  VerificationStep: async (category, id, formData) => {
    const token = await getToken();

    try {
      const res = await fetch(
        `${ENV.BASE_URL}/api/properties/${category}/${id}/verification`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      console.log("verification completed and posted:", data);

      return await data;
    } catch (error) {
      console.log("🔥 VERIFY API ERROR:", error);
      throw error;
    }
  },
};
