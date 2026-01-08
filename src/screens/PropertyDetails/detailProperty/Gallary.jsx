import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  FlatList,
  Modal,
} from "react-native";
import { useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";

const Gallery = ({ property }) => {
  const [visible, setVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  return (
    <View>
      <View style={styles.gallery}>
        <Text numberOfLines={1} style={styles.galleryText}>
          Gallery
        </Text>

        <FlatList
          data={property?.gallerySummary}
          horizontal
          keyExtractor={(item) => item.order.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <Pressable
              style={styles.galleryItem}
              onPress={() => {
                setImageUrl(item.url);
                setVisible(true);
              }}
            >
              <Image source={{ uri: item.url }} style={styles.galleryImage} />

              <View style={styles.overlay}>
                <Text style={styles.overlayText}>{item.category}</Text>
              </View>
            </Pressable>
          )}
        />
      </View>
      <Modal
        visible={visible}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.fullScreenContainer}>
          <View style={styles.fullScreenImageContainer}>
            {/* Close button */}
            <Pressable
              style={styles.closeButton}
              onPress={() => setVisible(false)}
            >
              <Entypo name="squared-cross" size={30} color="#fff" />
            </Pressable>

            <Image
              source={{ uri: imageUrl }}
              style={styles.fullScreenImage}
              // resizeMode="contain"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default Gallery;

const styles = StyleSheet.create({
  gallery: {
    marginVertical: 10,
  },

  galleryText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  galleryItem: {
    width: 280,
    height: 220,
    marginRight: 18,
    borderRadius: 12,
    overflow: "hidden",
  },

  galleryImage: {
    width: "100%",
    height: "100%",
  },

  fullScreenContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  fullScreenImageContainer: {
    width: "90%",
    height: "85%",
    borderRadius: 10,
    position: "relative",
    overflow: "hidden",
  },

  fullScreenImage: {
    width: "100%",
    height: "100%",
  },

  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    // backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 16,
    padding: 4,
  },
});
