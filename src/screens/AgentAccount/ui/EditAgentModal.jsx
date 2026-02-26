import React, { useEffect, useState, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import InputField from "../../../components/ui/InputField";
import DateInputField from "../../../components/ui/DateInputField";
import TextArea from "../../../components/ui/TextArea";
import { useAuth } from "../../../context/AuthContext";
import { agentServices } from "../../../services/agentServices";
import { useQueryClient } from "@tanstack/react-query";

const ALLOWED_PROFILE_FIELDS = [
  "name",
  "bio",
  "agencyName",
  "experienceYears",
  "areasServed",
  "coverImage",
  "avatar",
  "languages",
  "verificationStatus",
  "licenseNumber",
  "licenseValidTill",
  "city",
];

const EditAgentModal = ({ visible, onClose, agent }) => {
  const { userDetails, updateUserDetails } = useAuth();
  const queryClient = useQueryClient();

  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    agencyName: "",
    experienceYears: "",
    areasServed: "",
    languages: "",
    verificationStatus: "",
    licenseNumber: "",
    licenseValidTill: "",
    city: "",
    coverImage: "",
  });

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent?.user?.name || "",
        bio: agent?.bio || "",
        agencyName: agent?.agencyName || "",
        experienceYears: agent?.experienceYears || "",
        areasServed: agent?.areasServed || "",
        languages: agent?.languages || "",
        verificationStatus: agent?.verificationStatus || "",
        licenseNumber: agent?.licenseNumber || "",
        licenseValidTill: agent?.licenseValidTill || "",
        city: agent?.city || "",
        avatar: agent?.avatar?.url || "",
        coverImage: agent?.coverImage?.url || "",
      });
    }
  }, [agent, visible]);

  let phone = userDetails?.phone;

  const patchAgent = async (payload) => {
    if (!phone) {
      console.log("Phone missing");
      return;
    }

    await agentServices.updateAgentProfileByPhone(phone, payload);
  };

  const cleanPayload = useCallback((payload) => {
    return Object.keys(payload)
      .filter((key) => ALLOWED_PROFILE_FIELDS.includes(key))
      .reduce((acc, key) => {
        acc[key] = payload[key];
        return acc;
      }, {});
  }, []);

  const handleSave = async () => {
    const payload = {
      ...formData,
      areasServed: formData.areasServed?.filter(Boolean),
      languages: formData.languages?.filter(Boolean),
    };
    patchAgent(cleanPayload(payload));
    await updateUserDetails(payload);
    queryClient.invalidateQueries({
      queryKey: ["my-agent-profile"],
    });

    onClose();
  };

  const pickImage = async (type) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5,
      });

      if (!result.canceled) {
        const image = result.assets[0];

        const formattedImage = {
          uri: image.uri,
          type: "image/jpeg",
          fileName: "image.jpg",
        };

        if (type === "cover") {
          setFormData({ ...formData, coverImage: formattedImage });
          setCoverImage(formattedImage);
        } else {
          setFormData({ ...formData, avatar: formattedImage });
          setAvatar(formattedImage);
        }
      }
    } catch (error) {
      console.error("Image Pick Error:", error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.overlay}>
              <View style={styles.container}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ paddingBottom: 20 }}
                >
                  <View style={styles.content}>
                    <View>
                      <Text style={styles.title}>Edit Details</Text>
                      <Text style={styles.subText}>
                        Update your professional information.
                      </Text>
                    </View>
                    <TouchableOpacity onPress={onClose} hitSlop={5}>
                      <Entypo name="cross" size={24} color="black" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.subHeading}>Profile Image</Text>

                  <View style={styles.coverContainer}>
                    {/* Cover Image */}
                    <TouchableOpacity onPress={() => pickImage("cover")}>
                      <Image
                        source={{
                          uri:
                            coverImage?.uri ||
                            agent?.coverImage?.url ||
                            "https://via.placeholder.com/600x200",
                        }}
                        style={styles.cover}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>

                    {/* Avatar */}
                    <View style={styles.avatarWrapper}>
                      <TouchableOpacity onPress={() => pickImage("avatar")}>
                        <Image
                          source={{
                            uri:
                              avatar?.uri ||
                              agent?.avatar?.url ||
                              "https://via.placeholder.com/100",
                          }}
                          style={styles.avatar}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.wrapper}>
                    <Text style={styles.subHeading}>Basic Information</Text>

                    <InputField
                      label="Full Name"
                      value={formData?.name || ""}
                      onChange={(text) =>
                        setFormData({ ...formData, name: text })
                      }
                    />

                    <InputField
                      label="Agency Name"
                      value={formData?.agencyName || ""}
                      onChange={(text) =>
                        setFormData({ ...formData, agencyName: text })
                      }
                    />

                    <InputField
                      label="City"
                      value={formData?.city || ""}
                      onChange={(text) =>
                        setFormData({ ...formData, city: text })
                      }
                    />

                    <InputField
                      label="Experience (Years)"
                      value={formData?.experienceYears || ""}
                      keyboardType="numeric"
                      onChange={(text) =>
                        setFormData({
                          ...formData,
                          experienceYears: text,
                        })
                      }
                    />

                    <Text style={styles.subHeading}>Regulatory Details</Text>

                    <InputField
                      label="License Number"
                      value={formData?.licenseNumber || ""}
                      onChange={(text) =>
                        setFormData({
                          ...formData,
                          licenseNumber: text,
                        })
                      }
                    />
                    <DateInputField
                      label="License Valid Till"
                      value={formData.licenseValidTill?.split("T")[0] || ""}
                      onChangeText={(text) =>
                        setFormData({
                          ...formData,
                          licenseValidTill: text,
                        })
                      }
                    />

                    <InputField
                      label="RERA Agent ID"
                      value={formData?.reraAgentId || ""}
                      onChange={(text) =>
                        setFormData({
                          ...formData,
                          reraAgentId: text,
                        })
                      }
                    />

                    <Text style={styles.subHeading}>Bio & Service Areas</Text>

                    <TextArea
                      label="Professional Bio"
                      value={formData?.bio || ""}
                      maxLength={500}
                      onChange={(text) =>
                        setFormData({
                          ...formData,
                          bio: text,
                        })
                      }
                    />

                    <InputField
                      label="Areas Served (comma separated)"
                      value={(formData.areasServed || []).join(", ")}
                      onChange={(text) =>
                        setFormData({
                          ...formData,
                          areasServed: text
                            .split(",")
                            .map((item) => item.trim())
                            .filter(Boolean),
                        })
                      }
                    />

                    <InputField
                      label="Languages Spoken (comma separated)"
                      value={(formData.languages || []).join(", ")}
                      onChange={(text) =>
                        setFormData({
                          ...formData,
                          languages: text
                            .split(",")
                            .map((item) => item.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </View>

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={onClose}
                    >
                      <Text
                        style={{
                          color: "#27AE60",
                          fontWeight: "500",
                        }}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.saveBtn}
                      onPress={handleSave}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontWeight: "500",
                        }}
                      >
                        Save Changes
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default EditAgentModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
  },

  keyboardView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: "93%",
    backgroundColor: "#fff",
    padding: 13,
    borderRadius: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 3,
  },
  subText: {
    fontSize: 12,
    color: "gray",
    marginBottom: 15,
  },
  subHeading: {
    fontSize: 15,
    fontWeight: 500,
    marginVertical: 8,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  coverContainer: {
    marginTop: 10,
    width: "100%",
    height: 160,
    position: "relative",
  },

  cover: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },

  avatarWrapper: {
    position: "absolute",
    bottom: -27,
    left: 20,
  },

  avatar: {
    height: 60,
    width: 60,
    borderRadius: 12,
  },
  wrapper: {
    marginTop: 40,
  },

  input: {
    borderWidth: 1,
    borderColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 15,
    marginTop: 15,
  },
  cancelBtn: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#27AE60",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveBtn: {
    backgroundColor: "#27AE60",
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});
