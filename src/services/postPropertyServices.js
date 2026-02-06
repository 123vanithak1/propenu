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

      const data = await response.json();
      return {
        status: response.status,
        data,
      };
    } catch (error) {
      throw error;
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
      const res = await response.json();
      
      return res;
    } catch (error) {
        console.log("Error in basic details step:", error)
    }
  },

};
