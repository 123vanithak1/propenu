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

import GymArea from "../../../../assets/Amenities/Gymnasium.svg";
import ClubHouse from "../../../../assets/Amenities/Clubhouse.svg";
import SwimmingPool from "../../../../assets/Amenities/Swimming Pool.svg";
import SecurityIcon from "../../../../assets/Amenities/Security.svg";
import JoggingTrack from "../../../../assets/Amenities/Jogging.svg";
import KidsPlayArea from "../../../../assets/Amenities/KidsPlayArea.svg";
import CCTVIcon from "../../../../assets/Amenities/CCTVVideo Surveillance.svg";
import FireSafetyIcon from "../../../../assets/Amenities/Fire Fighting Systems.svg";
import PartyHall from "../../../../assets/Amenities/Party Hall.svg";
import ATM from "../../../../assets/Amenities/ATM's.svg";
import BaseBall from "../../../../assets/Amenities/Base Ball.svg";
import BasketBall from "../../../../assets/Amenities/Basketball.svg";
import Cricket from "../../../../assets/Amenities/Bowling.svg";
import CarWashing from "../../../../assets/Amenities/Car Washing Bays.svg";
import LiftIcon from "../../../../assets/Amenities/Elevator.svg";
import Park from "../../../../assets/Amenities/Park.svg";
import Restaurant from "../../../../assets/Amenities/Restaurant.svg";
import YogaCenter from "../../../../assets/Amenities/Yoga Area.svg";
import VisitorParking from "../../../../assets/Amenities/Visitor Parking.svg";
import KidsPool from "../../../../assets/Amenities/Kid's Pool.svg";
import SubWayPower from "../../../../assets/Amenities/Power Backup.svg";
import SolarHeaters from "../../../../assets/Amenities/Solar power provision.svg";
import TennisCourt from "../../../../assets/Amenities/Tennis Court(s).svg";
import { PartyIcon,SecurityIconn } from "../../../../assets/svg/AmenitiesIcons";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const AMENITY_ICON_MAP = {
  gym: GymArea,
  pool: KidsPool,
  clubhouse: ClubHouse,
  swimming_pool: SwimmingPool,
  jogging_track: JoggingTrack,
  children_play_area: KidsPlayArea,
  power_backup: SubWayPower,
  solar_heaters: SolarHeaters,
  car_washing: CarWashing,
  restaurant: Restaurant,
  lift: LiftIcon,
  party_hall: PartyHall,
  security: SecurityIcon,
  cctv: CCTVIcon,
  fire_safety: FireSafetyIcon,
  atm: ATM,
  basket_ball: BasketBall,
  base_ball: BaseBall,
  cricket: Cricket,
  park: Park,
  visitor_Parking: VisitorParking,
  yoga_deck: YogaCenter,
  kids_Pool: KidsPool,
  tennis_court: TennisCourt,
};

const AmenitiesWithModal = ({ amenities, color }) => {
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  return (
    <View style={styles.gallery}>
      <View style={styles.priceRow}>
        <Text style={[styles.galleryText, { color: color ? color : "green" }]}>
          Amenities
        </Text>

        {amenities?.length > 3 && (
          <Pressable
            onPress={() => setShowAllAmenities(true)}
            style={styles.viewMoreBtn}
          >
            <Text style={styles.viewMoreText}>View All</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.amenitiesGrid}>
        {amenities?.length === 0 && (
          <Text style={styles.amenityText}>
            Amenities information not available
          </Text>
        )}
        {amenities?.slice(0, 3).map((item, index) => {
          const IconComponent = AMENITY_ICON_MAP[item.key];
          return (
            <View key={`${item.key}-${index}`} style={styles.amenityCard}>
              {IconComponent ? (
                <IconComponent width={18} height={18} />
              ) : (
                <SecurityIconn width={18} height={18} />
              )}
              <Text style={styles.amenityText}>{item.title}</Text>
            </View>
          );
        })}
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
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => {
              const IconComponent = AMENITY_ICON_MAP[item.key];

              return (
                <View style={styles.amenityCardModal}>
                  {IconComponent ? (
                    <IconComponent width={22} height={22} />
                  ) : (
                   <SecurityIconn width={22} height={22} />
                  )}
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
    paddingVertical: 10,
    marginHorizontal: 12,
    borderRadius: 10,
  },
  amenityCard: {
    flexDirection: "row",
    gap: 8,
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
