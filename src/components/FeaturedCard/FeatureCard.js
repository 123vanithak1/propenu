import { View, Text, StyleSheet, FlatList } from "react-native";
import CardDetails from "./CardDetails";
import { apiService } from "../../services/apiService";
import React, { useEffect, useState } from "react";

const FeaturedCard = ({ navigation }) => {
  const [details, setDetails] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await apiService.featuredProjects();
        if (response.status === 200) {
          const data = response.data.items;
          setDetails(data);
        }
      } catch (error) {
        console.log("Featured Card Error:", error);
      }
    };

    fetchDetails();
  }, []);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Prime Properties</Text>
      {/* <Text style={styles.subtitle}>Exceptional properties Hyderabad</Text> */}
      <FlatList
        data={details}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <CardDetails
            details={item}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    // paddingVertical: 10,
  },
  title: { fontSize: 16, fontWeight: "600" },
  subtitle: {
    fontSize: 12,
    color: "#8f8d87ff",
    marginBottom: 8,
    marginTop: 2,
  },
});
export default FeaturedCard;
