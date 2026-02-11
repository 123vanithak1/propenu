import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { apiService } from "../../services/apiService";
import { ToastInfo } from "../../utils/Toast";

const MoreAgentDetails = ({ route }) => {
  const { slug } = route.params;

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await apiService.agentDetailsBySlug(slug);

      if (res?.success) {
        setDetails(res.data);
      }
    } catch (error) {
      console.log("Error when getting more details:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log("DETAILS IM MORE AGENT DETAILS :", details);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View>
      <Text>more agent details</Text>
    </View>
  );
};
export default MoreAgentDetails;
