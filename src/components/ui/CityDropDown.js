import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { closeDropdown, setCity } from "../../redux/slice/DropDownSlice";
import AntDesign from "@expo/vector-icons/AntDesign";
import useCity from "../../components/CustomHooks/useCity";

export default function CityDropdown() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.dropdown.isOpen);
  const [openState, setOpenState] = React.useState(null);

  const { locations, selectedCity, selectCity } = useCity();

  if (!isOpen) return null;

  const popularCities = locations.filter(
    (loc) => loc.category?.toLowerCase() === "popular",
  );

  const groupedByState = locations.reduce((acc, loc) => {
    if (!acc[loc.state]) acc[loc.state] = [];
    acc[loc.state].push(loc);
    return acc;
  }, {});

  return (
    <>
      {/* 🔹 BACKDROP (outside click close) */}
      <Pressable
        style={styles.pressableContainer}
        onPress={() => dispatch(closeDropdown())}
      />

      {/* 🔹 DROPDOWN */}
      <View style={styles.dropdownWrapper}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Popular cities */}
          {!!popularCities.length && (
            <>
              <Text style={styles.stateTitle}>Popular Cities</Text>
              {popularCities.map((item) => (
                <Pressable
                  key={item._id ?? item.city}
                  onPress={() => dispatch(setCity(item), selectCity(item))}
                  style={[
                    styles.cityItem,
                    selectedCity?._id === item._id && styles.selectedCityItem,
                  ]}
                >
                  <Text style={styles.cityText}>{item.city}</Text>
                </Pressable>
              ))}
            </>
          )}

          {/* Cities by state */}
          {Object.entries(groupedByState).map(([stateName, cities]) => {
            const isStateOpen = openState === stateName;

            return (
              <View key={stateName}>
                <Pressable
                  style={styles.stateHeader}
                  onPress={() => setOpenState(isStateOpen ? null : stateName)}
                >
                  <Text style={styles.stateTitle}>{stateName}</Text>
                  <AntDesign name={isStateOpen ? "minus" : "plus"} size={12} />
                </Pressable>

                {isStateOpen &&
                  cities.map((c) => (
                    <Pressable
                      key={c._id}
                      onPress={() => dispatch(setCity(c), selectCity(c))}
                      style={[
                        styles.cityItem,
                        selectedCity?._id === c._id && styles.selectedCityItem,
                      ]}
                    >
                      <Text style={styles.cityText}>{c.city}</Text>
                    </Pressable>
                  ))}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  pressableContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    elevation: 1,
  },
  dropdownWrapper: {
    position: "absolute",
    top: 80, // header height
    // left: 12,
    // right: 12,
    // maxHeight: "70%",
    width: "60%",
    alignSelf: "center",
    backgroundColor: "rgba(243, 255, 245)",
    borderRadius: 10,
    padding: 12,
    zIndex: 9999,
    elevation: 9999,
  },

  stateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },

  stateTitle: {
    fontWeight: "600",
    fontSize: 14,
  },

  cityItem: {
    paddingVertical: 8,
    paddingLeft: 10,
  },

  cityText: {
    fontSize: 13,
  },

  selectedCityItem: {
    backgroundColor: "#fff",
    borderRadius: 5,
  },
});
