import React, {useState} from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {ToastInfo} from "../../utils/Toast";

const SettingsScreen = () => {
  const user = {
    name: "Narahari Sharma",
    email: "Naraharisharma@gmail.com",
    phone: "9876543219",
    city: "Hyderabad",
    pincode: "503702",
  };

    // const [image, setImage] = useState("");
    const [image, setImage] = useState(
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&h=150&auto=format&fit=crop"
  );

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
     ToastInfo("Allow photo access to continue");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Card */}
      <View style={styles.profileCard}>
         <Pressable style={styles.avatarWrapper} onPress={pickImage}>
           <Image source={{ uri: image }} style={styles.avatar} />
          <View style={styles.cameraIcon}>
            <MaterialIcons name="photo-camera" size={14} color="#666" />
          </View>
        </Pressable>

        <View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userCity}>{user.city}</Text>
        </View>
      </View>

      {/* Personal Information */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal information</Text>

          <Pressable style={styles.editBtn}>
            <Text style={styles.editText}>Edit</Text>
            <Feather name="edit-2" size={14} color="#666" />
          </Pressable>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoGrid}>
            <InfoField label="First Name" value="Narahari" />
            <InfoField label="Last Name" value="Sharma" />
            <InfoField label="Email Address" value={user.email} />
            <InfoField label="Phone Number" value={user.phone} />
            <InfoField label="City" value={user.city} />
            <InfoField label="Pincode" value={user.pincode} />
          </View>
        </View>
      </View>

      {/* KYC Verification */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>KYC Verification</Text>

        <View style={styles.kycCard}>
          <Text style={styles.kycLabel}>Driving License</Text>
          <View style={styles.verified}>
            <MaterialIcons name="verified" size={18} color="#27A361" />
            <Text style={styles.verifiedText}>Verification done</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      {/* <Pressable>
        <Text style={styles.deactivate}>Deactivate Account</Text>
      </Pressable> */}
    </ScrollView>
  );
};

const InfoField = ({ label, value }) => (
  <View style={styles.infoField}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

export default SettingsScreen;
const styles = StyleSheet.create({
  container: {
    padding: 12,
    flex: 1,
    backgroundColor: "#F9F9F9",
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 1,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    // borderWidth:1,
    borderColor:"#ccc",
    backgroundColor:"#eeeeee"
  },

  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFF",
    padding: 3,
    borderRadius: 20,
    elevation: 2,
  },

  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  userCity: {
    fontSize: 12,
    color: "#999",
  },

  section: {
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#545454",
  },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#DDD",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  editText: {
    fontSize: 13,
    color: "#666",
  },

  infoCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    elevation: 1,
  },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 20,
  },

  infoField: {
    width: "48%",
  },

  infoLabel: {
    fontSize: 12,
    color: "#818181",
    letterSpacing: 0.5,
  },

  infoValue: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
  },

  kycCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginTop: 10,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
  },

  verified: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  verifiedText: {
    color: "#27A361",
    fontSize: 13,
    fontWeight: "500",
  },

  deactivate: {
    color: "#D32F2F",
    textDecorationLine: "underline",
    fontSize: 13,
    fontWeight: "500",
  },
});
