import { View, Text, TextInput, StyleSheet } from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { Voice_Mic } from "../../../assets/svg/Logo";

const SearchBar = ({ placeholder, value }) => {
  return (
    <View style={styles.search}>
      <EvilIcons style={{ width: 20 }} name="search" size={24} color="gray" />
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        placeholderTextColor="gray"
      />
      <Voice_Mic width={20} height={20} />
    </View>
  );
};

const styles = StyleSheet.create({
  search: {
    width: "85%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#ADADAD",
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 12,
    backgroundColor: "white",
  },
  input: {
    width: "90%",
    borderWidth: 0,
   paddingLeft:10,
    paddingVertical: 5,
    borderColor: "red",
  },
});
export default SearchBar;
