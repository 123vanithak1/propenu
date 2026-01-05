import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { apiService } from "../../services/apiService";
import { SafeAreaView } from "react-native-safe-area-context";

const PropertyDetailsScreen = ({ route }) => {
  const { propertyId } = route.params;

  const [property, setProperty] = useState(null);

  useEffect(() => {
    fetchPropertyDetails();
  }, [propertyId]);

  const fetchPropertyDetails = async () => {
    try {
      const res = await apiService.featuredProjectById(propertyId);
      console.log("response :", res.data.heroTagline);
      setProperty(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  if (!property) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No property found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {property?.heroImage ? (
          <Image
            source={{ uri: property.heroImage }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text>No Image</Text>
          </View>
        )}
        {/* <View style={styles.row}>
          {property?.logo?.url ? (
            <Image
              source={{ uri: property?.logo?.url }}
              style={styles.logo}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Text>No logo</Text>
            </View>
          )}
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PropertyDetailsScreen;
const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    // padding: 16,
  },
  image: {
    width: "100%",
    height: 220,
    paddingHorizontal: 5,
    backgroundColor: "#eee",
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logo: {
    width: 200,
    height: 200,
  },
});
