import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import {
  GymArea,
  KidsPool,
  BadmintonArea,
  YogaAreas,
  SubWayPower,
  SolarHeaters,
  CarWashing,
  DriverArea,
  LiftIcon,
  PartyIcon,
  SecurityIcon,
  CCTVIcon,
  FireSafetyIcon,
} from "../../../assets/svg/AmenitiesIcons";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const AMENITY_ICON_MAP = {
  gym: GymArea,
  pool: KidsPool,
  outdoor_sports: BadmintonArea,
  yoga_deck: YogaAreas,
  power_backup: SubWayPower,
  solar_heaters: SolarHeaters,
  car_washing: CarWashing,
  driver_area: DriverArea,
  lift: LiftIcon,
  party_hall: PartyIcon,
  security: SecurityIcon,
  cctv: CCTVIcon,
  fire_safety: FireSafetyIcon,
};

const AmenitiesWithModal = ({ amenities }) => {
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  return (
    <View style={styles.gallery}>
      <View style={styles.priceRow}>
        <Text style={styles.galleryText}>Amenities</Text>

        {amenities.length > 3 && (
          <Pressable
            onPress={() => setShowAllAmenities(true)}
            style={styles.viewMoreBtn}
          >
            <Text style={styles.viewMoreText}>View All</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.amenitiesGrid}>
        {amenities.slice(0, 3).map((item) => (
          <View key={item.key} style={styles.amenityCard}>
            <Text style={styles.amenityText}>{item.title}</Text>
          </View>
        ))}
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={showAllAmenities}
        onRequestClose={() => setShowAllAmenities(false)}
      >
        {/* Transparent overlay to dismiss on outside click */}
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowAllAmenities(false)}
        />

        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Amenities</Text>
          <FlatList
            data={amenities}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => {
              const IconComponent = AMENITY_ICON_MAP[item.key];

              return (
                <View style={styles.amenityCardModal}>
                  {IconComponent ?  <IconComponent width={24} height={24} />  : <PartyIcon />}
                  <Text style={styles.amenityText}>{item.title}</Text>
                </View>
              );
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

export default AmenitiesWithModal;
const styles = StyleSheet.create({
  gallery: {
    marginVertical: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  galleryText: {
    fontSize: 16,
    fontWeight: "600",
  },
  viewMoreBtn: {
    padding: 4,
  },
  viewMoreText: {
    color: "#27AE60",
    fontWeight: "600",
  },
  amenitiesGrid: {
    backgroundColor: "#FFFCF6",
    paddingHorizontal: 16,
    marginTop: 10,
    paddingVertical:10,
    marginHorizontal: 12,
    borderRadius: 10,
  },
  amenityCard: {
    borderRadius: 10,
    paddingVertical: 5,
  },
  amenityText: {
    fontSize: 14,
    // fontWeight:500
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(151, 147, 147, 0.5)",
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    height: SCREEN_HEIGHT * 0.75,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  amenityCardModal: {
    flexDirection: "row",
    borderRadius: 10,
    margin: 8,
    gap: 12,
  },
});
