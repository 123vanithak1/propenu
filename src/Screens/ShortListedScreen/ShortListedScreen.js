import { useEffect } from "react";
import { View, Text } from "react-native";

const ShortListedScreen = () => {

  useEffect(() => {
    const fetchdata = async () => {
      try {
        let res = await fetch(
          "http://192.168.1.43:4000/api/properties/residential/"
        );
        let result = await res.json();

        console.log("Result :", result);
      } catch (error) {
        console.log("error in fetchdata", error);
      }
    };
    fetchdata();
  }, []);

  return (
    <View>
      <Text>ShortListed Screen </Text>
    </View>
  );
};

export default ShortListedScreen;
