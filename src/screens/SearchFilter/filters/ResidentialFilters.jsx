import React, { useEffect, useRef, useState } from "react";
import {
  Switch,
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ScrollView,
  Keyboard,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useDispatch, useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import FilterBar from "./FilterBar";
import {
  selectCityWithLocalities,
  selectLocalitiesByCity,
} from "../../../redux/slice/CitySlice";
import {
  BUDGET_MAX,
  BUDGET_MIN,
  BUDGET_STEP,
  budgetOptions,
  CARPET_MAX,
  CARPET_MIN,
  carpetOptions,
  formatBudget,
  moreFilterSections,
} from "../../../data/constants";
import {
  setListingType,
  setCategory,
  setSearchText,
  categoryOption,
  setResidentialFilter,
} from "../../../redux/slice/FilterSlice";
import Dropdownui from "../../../components/ui/DropDownUI";
import { useAppSelector } from "../../../redux/store/store";

const ResidentialFilters = () => {
  const insets = useSafeAreaInsets();
  const [locationInput, setLocationInput] = useState("");
  const [locations, setLocations] = useState([]);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const cityData = useSelector(selectCityWithLocalities);
  const localities = useSelector(selectLocalitiesByCity);
  const filtersState = useSelector((state) => state.filters);

  const { category } = useAppSelector((s) => s.filters);
  console.log("category :", category);

  const { minBudget, maxBudget, residential } = filtersState;

  const { locality, bhk, postedBy } = residential;

  const inputRef = useRef(null);
  const TOTAL_STEPS = 2;
  const localityNames = [
    ...new Set(cityData.localities.map((item) => item.name)),
  ];
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [carpetRange, setCarpetRange] = useState([CARPET_MIN, CARPET_MAX]);

  // Map display labels to camelCase property names
  const keyMapping = {
    "Property Type": "propertyType",
    "Sales Type": "salesType",
    "Possession Status": "possessionStatus",
    "Covered Area": "coveredArea",
    Bathroom: "bathroom",
    Balcony: "balcony",
    Parking: "parking",
    Furnishing: "furnishing",
    Amenities: "amenities",
    Facing: "facing",
    "Verified Properties": "verifiedProperties",
    "Posted Since": "postedSince",
    "Posted By": "postedBy",
  };

  const bhkOptions = [
    "1 BHK",
    "2 BHK",
    "3 BHK",
    "4 BHK",
    "5 BHK",
    "6 BHK",
    // "6+ BHK",
  ];

  const CategoryTypes = [
    { label: "Residential", value: "residential" },
    { label: "Commercial", value: "commercial" },
    { label: "Agricultural", value: "agricultural" },
    { label: "Land", value: "land" },
  ];

  const getBhkNumber = (b) => {
    return b === "6+ BHK" ? 6 : Number(b.split(" ")[0]);
  };

  const bhkLabel = bhk ? `${bhk}${bhk === 6 ? "+" : ""} BHK` : "BHK";

  /* -------------------- BUDGET -------------------- */

  const BUDGET_MIN = 0;
  const BUDGET_MAX = 100000000;

  const [budgetRange, setBudgetRange] = useState([
    minBudget || BUDGET_MIN,
    maxBudget || BUDGET_MAX,
  ]);

  const budgetLabel =
    minBudget === BUDGET_MIN && maxBudget === BUDGET_MAX
      ? "Budget"
      : `${formatBudget(minBudget)} - ${formatBudget(maxBudget)}`;

  /* -------------------- POSTED BY -------------------- */

  const postedByOptions = ["Owners", "Agents", "Builders"];

  const handleSubmit = () => {
    const trimmed = locationInput.trim();
    if (!trimmed) return;

    // prevent duplicates
    if (!locations.includes(trimmed)) {
      setLocations([...locations, trimmed]);
    }

    setLocationInput("");
  };

  const removeLocation = (loc) => {
    setLocations(locations.filter((l) => l !== loc));
  };

  useEffect(() => {
    // small delay helps on Android
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FilterBar />

      {/* STEP 1 */}
      {step === 1 && (
        <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <Text style={styles.label}>City / Locality</Text>

            {/* SEARCH INPUT */}
            <View style={styles.inputWrapper}>
              <EvilIcons
                name="search"
                size={24}
                color="gray"
                style={styles.searchIcon}
              />
              <TextInput
                ref={inputRef}
                value={locationInput}
                onChangeText={setLocationInput}
                placeholder='Search "Hyderabad"'
                placeholderTextColor="gray"
                style={styles.input}
                returnKeyType="search"
                onSubmitEditing={handleSubmit}
              />
            </View>

            {/* SELECTED LOCATION CHIPS */}

            <View style={styles.selectedLoc}>
              {locations.map((loc) => (
                <View key={loc} style={[styles.chip]}>
                  <Text style={styles.chipText}>{loc}</Text>
                  <Pressable onPress={() => removeLocation(loc)}>
                    <Ionicons name="close" size={16} color="#1E8449" />
                  </Pressable>
                </View>
              ))}
            </View>

            <Text style={styles.localitiesHeading}>
              {cityData
                ? `Localities in ${cityData.city}`
                : "Select city first"}
            </Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {[...new Set(localities.map((l) => l.name))].map((name) => (
                <Pressable
                  key={name}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    backgroundColor: "#E9F7EF",
                    borderRadius: 6,
                  }}
                  onPress={() => {
                    if (!locations.includes(name)) {
                      setLocations([...locations, name]);
                    }
                  }}
                >
                  <Text style={styles.localitiesText}>{name}</Text>
                </Pressable>
              ))}
            </View>

            {/* <Text style={styles.subTitle}>Property type</Text>
            <View style={styles.toggleContainer}>
              {CategoryTypes.map((item) => {
                const isActive = category === item.label;

                return (
                  <Pressable
                    key={item.value}
                    onPress={() => dispatch(setCategory(item.label))}
                    style={[styles.toggleBtn, isActive && styles.activeBtn]}
                  >
                    <Text
                      style={[styles.toggleText, isActive && styles.activeText]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View> */}
          </View>
        </Pressable>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <View style={styles.content}>
          <View style={styles.row}>
            {/* Fixed Add button */}
            <Pressable style={styles.addButton} onPress={() => setStep(1)}>
              <Text style={{ fontSize: 13 }}>Add +</Text>
            </Pressable>

            {/* Scrollable locations */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.locationScroll}
            >
              {locations.map((loc) => (
                <View key={loc} style={[styles.chip, { marginRight: 6 }]}>
                  <Text style={styles.chipText}>{loc}</Text>
                  <Pressable
                    onPress={() => removeLocation(loc)}
                    style={{ paddingLeft: 5 }}
                  >
                    <Ionicons name="close" size={17} color="#1E8449" />
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          </View>
          <ScrollView style={styles.contentBar}>
            <Text style={styles.subTitle}>Budget</Text>
            <View style={styles.budget}>
              <View style={styles.minMaxBudget}>
                <Dropdownui
                  label="Minimum"
                  value={budgetRange[0]}
                  options={budgetOptions.map((t) => ({
                    label: formatBudget(t),
                    value: t,
                  }))}
                  onChange={(value) => setBudgetRange([value, budgetRange[1]])}
                />
              </View>

              <View style={styles.minMaxBudget}>
                <Dropdownui
                  label="Maximum"
                  value={budgetRange[1]}
                  options={budgetOptions.map((t) => ({
                    label: formatBudget(t),
                    value: t,
                  }))}
                  onChange={(value) => setBudgetRange([budgetRange[0], value])}
                />
              </View>
            </View>

            <Text style={styles.subTitle}>BHK</Text>
            <View style={styles.toggleContainer}>
              {bhkOptions.map((opt) => {
                const value = getBhkNumber(opt);
                return (
                  <Pressable
                    key={opt}
                    onPress={() => {
                      dispatch(
                        setResidentialFilter({
                          key: "bhk",
                          value,
                        })
                      );
                    }}
                    style={[styles.bhkData, bhk === value && styles.activeChip]}
                  >
                    <Text style={styles.labelText}>{opt}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={styles.subTitle}>Posted By</Text>
            <View style={styles.toggleContainer}>
              {postedByOptions.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => {
                    dispatch(
                      setResidentialFilter({
                        key: "postedBy",
                        value: item,
                      })
                    );
                  }}
                  style={[
                    styles.bhkData,
                    postedBy === item && styles.activeChip,
                  ]}
                >
                  <Text style={styles.labelText}>{item}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              style={styles.moreFilterHeader}
              onPress={() => setOpen(!open)}
            >
              {/* <View style={styles.badge}>
                    <Text style={styles.badgeText}>{selectedMoreFiltersCount}</Text>
                  </View> */}

              <Text style={styles.moreFilterText}>More Filters</Text>

              <Text>{open ? "▲" : "▼"}</Text>
            </Pressable>
          </ScrollView>
        </View>
      )}

      {/* BOTTOM BAR */}
      <View style={[styles.buttonBar, { paddingBottom: 60 }]}>
        <Text
          style={styles.clearText}
          onPress={() => {
            setLocations([]);
            // setLocationInput("");
            // setStep(1);
          }}
        >
          Clear
        </Text>

        <Pressable
          style={styles.nextButton}
          onPress={() =>
            setStep((prev) => (prev < TOTAL_STEPS ? prev + 1 : prev))
          }
        >
          <Text style={styles.nextText}>
            {step === TOTAL_STEPS ? "Search" : "Next"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default ResidentialFilters;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 10,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  moreFilterHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginVertical: 8,
  },
  badge: {
    backgroundColor: "#27AE60",
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  moreFilterText: {
    flex: 1,
    fontWeight: "600",
    fontSize: 14,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  budget: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 8,
    marginVertical: 5,
  },
  minMaxBudget: {
    flex: 1,
  },
  contentBar: {
    padding: 5,
    marginVertical: 5,
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 5,
    paddingVertical: 10,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  locationScroll: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedLoc: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginVertical: 10,
  },

  subTitle: {
    fontSize: 14,
    fontWeight: 500,
    paddingLeft: 8,
  },

  addButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  searchIcon: {
    marginRight: 5,
  },
  localitiesHeading: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 10,
  },

  localitiesText: {
    fontSize: 12,
    paddingVertical: 3,
  },

  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
  },

  chipContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E9F7EF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    // marginRight: 10, // spacing between chips
    // gap: 6,
  },

  chipText: {
    color: "#1E8449",
    fontSize: 13,
    fontWeight: "500",
  },

  buttonBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 10,
  },

  clearText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#27AE60",
  },

  nextButton: {
    paddingHorizontal: 50,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#27AE60",
  },

  nextText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  toggleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    gap: 10,
  },
  bhkData: {
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  optionActive: {
    borderColor: "#22c55e",
    backgroundColor: "#dcfce7",
  },
  labelText: {
    fontSize: 12,
    // color:"gray"
  },

  activeChip: {
    backgroundColor: "#E9F7EF",
    borderColor: "#27AE60",
  },
  option: {
    paddingVertical: 8,
  },
  activeOption: {
    backgroundColor: "#f2f2f2",
  },

  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    // backgroundColor:"green",
    borderRadius: 6,
  },

  activeBtn: {
    backgroundColor: "#27AE60",
  },

  toggleText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
});
