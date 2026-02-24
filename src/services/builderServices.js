import { ENV } from "../../config";
import { API_ROUTES } from "./apiRoutes";
import { ToastError, ToastSuccess } from "../utils/Toast";
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

export const builderServices = {
  getBuilderAnalytics: async () => {
    const token = await getToken();
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.BUILDER.BUILDER_ANALYTICS}`,
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
   getBuilderProperties: async () => {
    const token = await getToken();
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.BUILDER.BUILDER_MYPROPERTIES}`,
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
   getBuilderFeaturedProperties: async () => {
    const token = await getToken();
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.BUILDER.BUILDER_FEATURED_PROPERTIES}`,
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
  PostLeads: async ( payload ) => {
  try {
    const response = await fetch(
      `${ENV.BASE_URL}${API_ROUTES.BUILDER.LEADS}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), 
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Something went wrong");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error when posting leads:", error);
  }
}
};
