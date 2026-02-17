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
export const agentServices = {

    
  getAgent: async (dateRange = "30") => {
    const token = await getToken();
    console.log("Final URL :",  `${ENV.BASE_URL}${API_ROUTES.AGENT.AGENT_PROFILE}/my?range=${dateRange}` )
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.AGENT.AGENT_PROFILE}/my?range=${dateRange}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Something went wrong");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error :", error);
    }
  },
};
