import { ENV } from "../../config";
import { API_ROUTES } from "./apiRoutes";
import * as Keychain from "react-native-keychain";
import ReactNativeBlobUtil from "react-native-blob-util";
import { ToastSuccess } from "../utils/Toast";

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
    try {
      const token = await getToken();

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
        throw new Error("Failed to post shortlisted property");
      }

      const data = await response.json();
      console.log("Response when posting:", data);
      return data;
    } catch (error) {
      console.error("Post shortlist error:", error);
      throw error; // important for React Query
    }
  },

  deleteShortlistedProperty: async (propertyId) => {
    try {
      const token = await getToken();

      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.SHORTLIST.SHORTLISTED_PROP}/${propertyId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete shortlisted property");
      }

      const data = await response.json();
      console.log("Response when deleting:", data);

      return data;
    } catch (error) {
      console.error("Delete shortlist error:", error);
      throw error;
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

  getProjectLeads: async (projectId, from, to) => {
    const params = new URLSearchParams();

    if (from) params.append("from", from.toISOString());
    if (to) params.append("to", to.toISOString());

    const query = params.toString();
    try {
      const response = await fetch(
        `${ENV.BASE_URL}/api/properties/leads/project/${projectId}/leads${
          query ? `?${query}` : ""
        }`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch project builder leads");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(
        "GET PROJECT LEADS ERROR:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  // getProjectLeads: async (projectId) => {
  //   const token = await getToken();
  //   console.log(projectId, "MyProjectLeadsid");
  //   try {
  //     if (!token) {
  //       console.log("No token found");
  //       return null;
  //     }
  //     console.log(
  //       "Leads 1api 111:",
  //       `${ENV.BASE_URL}/api/properties/leads/project/${projectId}/leads`,
  //     );
  //     const response = await fetch(
  //       `${ENV.BASE_URL}/api/properties/leads/project/${projectId}/leads`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );

  //     // const response = await fetch(
  //     //   `${ENV.BASE_URL}${API_ROUTES.SHORTLIST.LEADS}`,
  //     //   {
  //     //     params: { projectId },
  //     //     headers: {
  //     //       "Content-Type": "application/json",
  //     //       Authorization: `Bearer ${token}`,
  //     //     },
  //     //   },
  //     // );
  //     if (!response.ok) {
  //       throw Error("Error when getting enquiries");
  //     }

  //     return response.json();
  //   } catch (error) {
  //     console.log(
  //       "GET PROJECT LEADS ERROR:",
  //       error.response?.data || error.message,
  //     );
  //     throw error;
  //   }
  // },

  getMyAgentProfile: async () => {
    const token = await getToken();
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.AGENT.AGENT_DETAILS}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error fetching agent profile:", error);
      return null;
    }
  },
  getMembershipHistory: async () => {
    const token = await getToken();
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.PAYMENTS.PAYMENTS_HISTORY}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error fetching agent profile:", error);
      return null;
    }
  },

  downloadLeadsCSV: async (projectId, from, to) => {
    try {
      const params = new URLSearchParams();

      if (from) params.append("from", from);
      if (to) params.append("to", to);

      const downloadUrl = `${ENV.BASE_URL}/api/properties/leads/project/${projectId}/leads/csv?${params.toString()}`;

      const { config, fs } = ReactNativeBlobUtil;

      const downloadPath = fs.dirs.DownloadDir + `/leads_${Date.now()}.csv`;

      const res = await config({
        fileCache: true,
        path: downloadPath,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: downloadPath,
          title: "Leads.csv",
          description: "Downloading leads CSV",
          mime: "application/vnd.ms-excel",
          mediaScannable: true,
        },
      }).fetch("GET", downloadUrl);

      ToastSuccess("Download completed");

      ReactNativeBlobUtil.android.actionViewIntent(
        res.path(),
        "application/vnd.ms-excel",
      );
      // ToastSuccess("Download completed");

      console.log("Download completed:", downloadPath);
    } catch (error) {
      console.log("Download error:", error);
    }
  },
  updateLeadStatus: async (id, status) => {
    try {
      const response = await fetch(
        `${ENV.BASE_URL}/api/properties/leads/project/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Something went wrong");
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Update Lead Status Error:", error);
      throw error;
    }
  },

  // ─── DigiLocker KYC ──────────────────────────────────────────────────────

  /**
   * GET /api/users/kyc/start
   * Returns { url } — the DigiLocker OAuth authorization URL.
   * Option A: pass this URL to KycWebViewModal.
   * Option B: pass this URL to WebBrowser.openAuthSessionAsync().
   */
  startKyc: async () => {
    const token = await getToken();
    const response = await fetch(`${ENV.BASE_URL}${API_ROUTES.KYC.START}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.message || "Failed to start KYC");
    }

    return response.json(); // { url }
  },

  /**
   * PATCH /api/users/kyc/details
   * Accepts { name, email, pincode, locality, city, state } (all optional).
   * Returns { token, user } — a fresh JWT with accountStatus reset to kyc_pending.
   * Call saveTokenAndRefresh(data.token) in AuthContext after this.
   */
  updateKycDetails: async (payload) => {
    console.log({ payload });
    const token = await getToken();
    const response = await fetch(
      `${ENV.BASE_URL}${API_ROUTES.KYC.UPDATE_DETAILS}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.message || "Failed to update KYC details");
    }
    const data = await response.json();
    console.log("response", data);
    return data; // { token, user }
  },

  getUserProfile: async () => {
    const token = await getToken();
    if (!token) return null;
    try {
      const response = await fetch(
        `${ENV.BASE_URL}${API_ROUTES.AUTH.VERIFY_TOKEN}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      const data = await response.json();
      return data; // returns { user: { ... } }
    } catch (error) {
      console.log("Error fetching user profile:", error);
      throw error;
    }
  },
};
