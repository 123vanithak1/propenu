import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getItem } from "../../../utils/Storage";
import { ToastSuccess, ToastInfo } from "../../../utils/Toast";
import useDimensions from "../../../components/CustomHooks/UseDimension";
import formatINR from "../../../utils/FormatINR";
import { apiService } from "../../../services/apiService";
import {
  AreaIcon,
  BedIcon,
  ReadyToMoveIcon,
  PhoneIcon,
} from "../../../../assets/svg/Logo";
import AutoImageSlider from "../../../components/ui/AutoImageSlider";

const CommercialCard = ({ item }) => {
  const { width } = useDimensions();
  const navigation = useNavigation();

  const handlePress = async () => {
    console.log("Checking property id : ", item.id);
    navigation.navigate("MorePropertyDetails", {
      id: item.id,
    });
  };

  const handleContact = async () => {
    const userData = await getItem("user");
    if (!userData || !userData.user) {
      ToastInfo("User not authenticated");
    } else {
      ToastSuccess("We will contact you shortly");
    }
  };

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      {/* Image slider */}
      <AutoImageSlider
        images={item.gallery.map((img) => ({ uri: img.url }))}
        height={180}
        width={width * 0.9}
      />

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.title} numberOfLines={1}>
            {item.buildingName}
          </Text>
          <Text style={styles.price}>{formatINR(item.price)}</Text>
        </View>

        <Text style={styles.subTitle} numberOfLines={2}>
          {item.title}
        </Text>

        {/* Meta */}
        <View style={styles.metaRow}>
          <MetaItem
            Icon={AreaIcon}
            label="Area"
            value={`${item.builtUpArea ?? "—"} sqft`}
          />
          <MetaItem
            Icon={BedIcon}
            label="Furnishing"
            value={item.furnishing || "Unfurnished"}
          />
          <MetaItem
            Icon={ReadyToMoveIcon}
            label="Parking"
            value={`${item?.parkingDetails?.twoWheeler || 0} + ${
              item?.parkingDetails?.fourWheeler || 0
            }`}
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.priceBox}>
        <Text style={styles.priceSub}>Owner</Text>

        <Pressable style={styles.button} onPress={handleContact}>
          <PhoneIcon width={18} height={18} />
          <Text style={styles.buttonText}>Contact</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

const MetaItem = ({ label, value, Icon }) => (
  <View style={styles.metaItemRow}>
    <Icon width={20} height={20} />
    <View style={{ gap: 3 }}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  </View>
);

export default React.memo(CommercialCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 2,
    padding: 10,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
  },
  subTitle: {
    fontSize: 13,
    marginVertical: 5,
    // color: "#585757ff",
    // marginLeft: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    marginRight: 5,
  },
  metaItemRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
    gap: 7,
  },
  metaItem: {
    // alignItems: "center",
    gap: 3,
  },
  metaLabel: {
    fontSize: 11,
    color: "#777",
  },
  metaValue: {
    fontSize: 12,
    fontWeight: "500",
  },
  priceBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#EAF8F0",
    marginTop: 10,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#27AE60",
  },
  priceSub: {
    fontSize: 13,
    fontWeight: 500,
    // color: "#555",
  },
  button: {
    flexDirection: "row",
    paddingHorizontal: 30,
    backgroundColor: "#27AE60",
    paddingVertical: 7,
    borderRadius: 6,
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
