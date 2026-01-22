import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { userServices } from "../../services/userServices";
import * as Keychain from "react-native-keychain";

const ShortListedScreen = () => {

  const [likedProperties, setLikedProperties] = useState(null);

  const fetchShortlistedProperties = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();

      if (!credentials) {
        console.log("No token found in keychain");
        return;
      }

      const token = credentials.password;

      const response = await userServices.getShortlistedProperties(token);
      if (response?.status === 200) {
        setLikedProperties(response?.data?.data);
      }
    } catch (error) {
      console.log("Error when getting shortlisted properties:", error);
    }
  };
  useEffect(() => {
    fetchShortlistedProperties();
  }, []);

  return (

    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {likedProperties?.length > 0 ? (
        <Text>Your shortlisted properties will appear here</Text>
      ) : (
        <Text>No properties selected</Text>
      )}
    </View>
  );
};

export default ShortListedScreen;
