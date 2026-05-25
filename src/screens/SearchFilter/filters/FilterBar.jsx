import { View, Text, Pressable, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../redux/store/store";
import { useNavigation } from "@react-navigation/native";
import { setListingType} from "../../../redux/slice/FilterSlice";

const FilterBar = () => {
  const dispatch = useDispatch();
  const { listingTypeValue } = useAppSelector((s) => s.filters);
  const navigation = useNavigation();

  const LISTING_TYPES = [
    { label: "Sale", value: "sale" },
    { label: "Rent", value: "rent" },
  ];

  const onClear = () => {
    navigation.navigate("Drawer");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listing Type</Text>
      <View style={styles.toggleContainer}>
        {LISTING_TYPES.map((item) => {
          const isActive = listingTypeValue === item.value;

          return (
            <Pressable
              key={item.value}
              onPress={() =>
                dispatch(
                  setListingType({
                    label: item.label,
                    value: item.value,
                  }),
                )
              }
              style={[styles.toggleBtn, isActive && styles.activeBtn]}
            >
              <Text style={[styles.toggleText, isActive && styles.activeText]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* <Pressable onPress={onClear} style={styles.clearBtn}>
        <Ionicons name="close" size={22} color="#555" />
      </Pressable> */}
    </View>
  );
};

export default FilterBar;
const styles = StyleSheet.create({
  container: {
    // flexDirection: "row",
    // alignItems: "center",
    paddingBottom: 15,
  },

  toggleContainer: {
    flexDirection: "row",
    gap: 15,
    flex: 1,
    paddingLeft: 5,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
    // color :"#000"
  },

  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  activeBtn: {
    borderWidth: 1,
    borderColor: "#27AE60",
    backgroundColor: "#E9F7EF",
  },

  toggleText: {
    fontSize: 13,
    // color: "#555",
    // fontWeight: "500",
  },

  activeText: {
    fontWeight: "500",
    color: "#27AE60",
  },

  clearBtn: {
    padding: 6,
    marginLeft: 6,
  },
});
