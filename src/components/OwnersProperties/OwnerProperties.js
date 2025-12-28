import { View, Text, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { apiService } from "../../services/apiService";
import OwnerPropertyCard from "./OwnerPropertyCard";

const OwnerProperties = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchOwnerProperties = async () => {
      try {
        const response = await apiService.ownersProperties();
        if (response.status === 200) {
          const data = response.data.items;
          setProperties(data);
        }
      } catch (error) {
        console.log("Owners Properties Error:", error);
      }
    };
    fetchOwnerProperties();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Properties by Owners</Text>
      <FlatList
        data={properties}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <OwnerPropertyCard details={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    // backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
});
export default OwnerProperties;
