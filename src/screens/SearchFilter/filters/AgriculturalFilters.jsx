import React, { useEffect, useRef, useState, useMemo } from "react";
import Fuse from "fuse.js";
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
import { useNavigation } from "@react-navigation/native";
import {
  selectCityWithLocalities,
  selectLocalitiesByCity,
} from "../../../redux/slice/CitySlice";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import useCity from "../../../components/CustomHooks/useCity";
import {
  budgetOptions,
  CARPET_MAX,
  CARPET_MIN,
  carpetOptions,
  formatBudget,
  agriculturalMoreFilterSections,
} from "../../../data/constants";
import { setAgriculturalFilter, resetAgriculturalFilters } from "../../../redux/slice/FilterSlice";
import Dropdownui from "../../../components/ui/DropDownUI";
import { ToastInfo, ToastSuccess } from "../../../utils/Toast";
import filterStyles from "./filterStyles";

const AgriculturalFilters = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [locationInput, setLocationInput] = useState("");
  const [selectedOptions, setSelectedOptions] = useState({});
  const [locations, setLocations] = useState([]);
  const [isOpenMore, setIsOpenMore] = useState(false);
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const cityData = useSelector(selectCityWithLocalities);
  const localities = useSelector(selectLocalitiesByCity);
  const filtersState = useSelector((state) => state.filters);

  const localityNames = useMemo(() => {
    return cityData?.localities
      ? [...new Set(cityData.localities.map((item) => item.name))]
      : [];
  }, [cityData]);

  const filteredLocalities = useMemo(() => {
    if (!locationInput.trim()) {
      return localityNames;
    }
    const fuse = new Fuse(localityNames, {
      threshold: 0.3,
    });
    return fuse.search(locationInput).map((res) => res.item);
  }, [localityNames, locationInput]);

  const { selectedCity } = useCity();

  const { minBudget, maxBudget, agricultural, listingTypeValue } = filtersState;

  const { postedBy, locality } = agricultural;

  const rightPanelRef = useRef(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [carpetRange, setCarpetRange] = useState([CARPET_MIN, CARPET_MAX]);

  const keyMapping = {
    "Agricultural Type": "agriculturalType",
    "Agricultural Sub Type": "agriculturalSubType",
    "Total Area": "totalArea",
    "Area Unit": "areaUnit",
    "Verified Properties": "verifiedProperties",
    "Soil Type": "soilType",
    "Irrigation Type": "irrigationType",
    "Number of Borewells": "numberOfBorewells",
    "Water Source": "waterSource",
    "Electricity Connection": "electricityConnection",
    "Current Crop": "currentCrop",
    "Plantation Age": "plantationAge",
    "Road Width": "roadWidth",
    "Access Road Type": "accessRoadType",
    "Boundary Wall": "boundaryWall",
    "State Restrictions": "stateRestrictions",
    "Price Negotiable": "priceNegotiable",
    "Posted Since": "postedSince",
    "Posted By": "postedBy",
  };

  // Budget Range

  const BUDGET_MIN = 0;
  const BUDGET_MAX = 100000000;

  const [budgetRange, setBudgetRange] = useState([
    minBudget || BUDGET_MIN,
    maxBudget || BUDGET_MAX,
  ]);

  /* -------------------- POSTED BY -------------------- */

  const postedByOptions = ["Owners", "Agents"];
   const getSelectedMoreFiltersCount = () => {
    let count = 0;

    Object.values(keyMapping).forEach((key) => {
      const value = agricultural[key];

      if (Array.isArray(value)) {
        count += value.length;
      } else if (typeof value === "boolean") {
        if (value) count += 1;
      } else if (value !== undefined && value !== null && value !== "") {
        count += 1;
      }
    });

    return count;
  };
  const selectedMoreFiltersCount = getSelectedMoreFiltersCount();
  const localityCount = locality ? 1 : 0;
  const listingTypeCount = listingTypeValue ? 1 : 0;
  const moreFiltersBadgeCount =
    selectedMoreFiltersCount + localityCount + listingTypeCount;
  const displayedMoreFiltersBadgeCount = moreFiltersBadgeCount || 2;

  const handleSubmit = () => {
    const trimmed = locationInput.trim();
    if (!trimmed) return;
    console.log("Submitting location:", trimmed);

    // prevent duplicates
    if (!locations.includes(trimmed)) {
      setLocations([...locations, trimmed]);
      dispatch(
        setAgriculturalFilter({
          key: "locality",
          value: trimmed,
        }),
      );
    }
    setLocationInput("");
  };

  const handleSwitch = (val) => {
    setVerifiedOnly(val);
    // if (val) ToastSuccess("Verified properties enabled");
    // else ToastSuccess("Verified properties disabled");
  };

  const removeLocation = (loc) => {
    setLocations(locations.filter((l) => l !== loc));
  };

  const [activeFilter, setActiveFilter] = useState(
    agriculturalMoreFilterSections[0]?.key,
  );

  const sectionRefs = useRef({});

  const handleSectionClick = (key) => {
    setActiveFilter(key);

    sectionRefs.current[key]?.measureLayout(rightPanelRef.current, (x, y) => {
      rightPanelRef.current.scrollTo({ y, animated: true });
    });
  };

  const toggleArrayValue = (arr, value) => {
    const safeArr = Array.isArray(arr) ? arr : [];
    return safeArr.includes(value)
      ? safeArr.filter((v) => v !== value)
      : [...safeArr, value];
  };

  const toggleOption = (sectionKey, option, selectionType) => {
    const mappedKey = keyMapping[sectionKey];
    const currentValue = agricultural[mappedKey];

    setSelectedOptions((prev) => {
      const sectionValues = prev[sectionKey] || [];

      if (selectionType === "single") {
        return {
          ...prev,
          [sectionKey]: [option],
        };
      }
      console.log("section key :", sectionKey, option);
      return {
        ...prev,
        [sectionKey]: sectionValues.includes(option)
          ? sectionValues.filter((v) => v !== option)
          : [...sectionValues, option],
      };
    });

    dispatch(
      setAgriculturalFilter({
        key: mappedKey,
        value:
          selectionType === "multiple"
            ? toggleArrayValue(currentValue || [], option)
            : option,
      }),
    );
  };

  const handleSearch = async () => {
    console.log("Searching with agricultural filters...");
    navigation.navigate("PropertyList");
  };

  const handleClearButton = () => {
    setLocations([]);
    setLocationInput("");
    setBudgetRange([BUDGET_MIN, BUDGET_MAX]);
    setSelectedOptions({});
    setVerifiedOnly(false);
    setCarpetRange([CARPET_MIN, CARPET_MAX]);
    dispatch(resetAgriculturalFilters());
    ToastInfo("All filters have been cleared.");
  }

  const activeSection = agriculturalMoreFilterSections.find(
    (section) => section.key === activeFilter,
  );

  return (
    <View style={filterStyles.container}>
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View style={filterStyles.content}>
          <Text style={filterStyles.label}>City / Locality</Text>

          {/* SEARCH INPUT */}
          <View style={filterStyles.inputWrapper}>
            <EvilIcons
              name="search"
              size={24}
              color="gray"
              style={filterStyles.searchIcon}
            />
            <TextInput
              // ref={inputRef}
              value={locationInput}
              onChangeText={setLocationInput}
              placeholder={`Search in ${selectedCity?.city ?? "City"} `}
              placeholderTextColor="gray"
              style={filterStyles.input}
              returnKeyType="search"
              onSubmitEditing={handleSubmit}
            />
          </View>

          {/* SELECTED LOCATION CHIPS */}
          <View style={filterStyles.selectedLoc}>
            {locations.map((loc) => (
              <View key={loc} style={[filterStyles.chip]}>
                <Text style={filterStyles.chipText}>{loc}</Text>
                <Pressable onPress={() => removeLocation(loc)}>
                  <Ionicons name="close" size={16} color="#1E8449" />
                </Pressable>
              </View>
            ))}
          </View>

          <Text style={filterStyles.localitiesHeading}>
            {cityData ? `Localities in ${cityData.city}` : "Select city first"}
          </Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {filteredLocalities.map((name) => (
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
                    dispatch(
                      setAgriculturalFilter({
                        key: "locality",
                        value: name,
                      }),
                    );
                  }
                }}
              >
                <Text style={filterStyles.localitiesText}>+ {name}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Pressable>

      <View style={filterStyles.contentBar}>
        <Text style={filterStyles.subTitle}>Budget</Text>
        <View style={filterStyles.budget}>
          <View style={filterStyles.minMaxBudget}>
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

          <View style={filterStyles.minMaxBudget}>
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

        {/* <Text style={filterStyles.subTitle}>Plot Area</Text>
        <View style={filterStyles.budget}>
          <View style={filterStyles.minMaxBudget}>
            <Dropdownui
              label="Minimum"
              value={carpetRange[0]}
              options={carpetOptions.map((t) => ({
                label: `${t} sqft`,
                value: t,
              }))}
              onChange={(value) => setCarpetRange([value, carpetRange[1]])}
            />
          </View>

          <View style={filterStyles.minMaxBudget}>
            <Dropdownui
              label="Maximum"
              value={carpetRange[1]}
              options={carpetOptions.map((t) => ({
                label: `${t} sqft`,
                value: t,
              }))}
              onChange={(value) => setCarpetRange([carpetRange[0], value])}
            />
          </View>
        </View> */}

        <Text style={filterStyles.subTitle}>Posted By</Text>
        <View style={filterStyles.toggleContainer}>
          {postedByOptions.map((item) => (
            <Pressable
              key={item}
              onPress={() => {
                dispatch(
                  setAgriculturalFilter({
                    key: "postedBy",
                    value: item,
                  }),
                );
              }}
              style={[
                filterStyles.bhkData,
                postedBy === item && filterStyles.activeChip,
              ]}
            >
              <Text
                style={[
                  filterStyles.labelText,
                  postedBy === item && filterStyles.activeChipText,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={filterStyles.moreFilterHeader}
          onPress={() => {
            setIsOpenMore(!isOpenMore);
          }}
        >
          {/* <View style={filterStyles.badge}>
                    <Text style={filterStyles.badgeText}>{selectedMoreFiltersCount}</Text>
                  </View> */}

          <Text style={filterStyles.moreFilterText}>
            Advanced Filters (Optional)
          </Text>

          <AntDesign name={isOpenMore ? "up" : "down"} size={12} color="#000" />
        </Pressable>
      </View>

      {isOpenMore && (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <View style={filterStyles.sectionContainer}>
            {/* LEFT PANEL */}
            <View style={filterStyles.leftPanel}>
              {agriculturalMoreFilterSections.map((section) => (
                <Pressable
                  key={section.key}
                  onPress={() => handleSectionClick(section.key)}
                  style={[
                    filterStyles.leftItem,
                    activeFilter === section.key && filterStyles.leftItemActive,
                  ]}
                >
                  <Text
                    style={[
                      filterStyles.leftText,
                      activeFilter === section.key &&
                        filterStyles.leftTextActive,
                    ]}
                  >
                    {section.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* RIGHT PANEL */}
            <ScrollView
              ref={rightPanelRef}
              style={filterStyles.rightPanel}
              contentContainerStyle={{ paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            >
              {activeSection && (
                <View key={activeSection.key} style={filterStyles.section}>
                  <Text style={filterStyles.sectionTitle}>
                    {activeSection.label}
                  </Text>

                  {activeSection.key === "Verified Properties" ? (
                    <View style={filterStyles.verifiedRow}>
                      <Text>Verified</Text>
                      <Switch
                        style={{
                          transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                        }}
                        value={verifiedOnly}
                        onValueChange={(val) => handleSwitch(val)}
                        trackColor={{ false: "#bdbdbd", true: "#A9DFBF" }}
                        thumbColor={verifiedOnly ? "#27AE60" : "#f0eeee"}
                        ios_backgroundColor="#E0E0E0"
                      />
                    </View>
                  ) : activeSection.key === "Total Area" ? (
                    <View style={filterStyles.budgetArea}>
                      <View style={filterStyles.minMaxBudget}>
                        <Dropdownui
                          label="Minimum"
                          value={carpetRange[0]}
                          options={carpetOptions.map((t) => ({
                            label: `${t} Sqft`,
                            value: t,
                          }))}
                          onChange={(value) =>
                            setCarpetRange([value, carpetRange[1]])
                          }
                        />
                      </View>

                      <View style={filterStyles.minMaxBudget}>
                        <Dropdownui
                          label="Maximum"
                          value={carpetRange[1]}
                          options={carpetOptions.map((t) => ({
                            label: `${t} Sqft`,
                            value: t,
                          }))}
                          onChange={(value) =>
                            setCarpetRange([carpetRange[0], value])
                          }
                        />
                      </View>
                    </View>
                  ) : (
                    <View>
                      {activeSection.options?.map((opt) => {
                        const isChecked =
                          selectedOptions[activeSection.key]?.includes(opt);

                        const isSingle =
                          activeSection.selectionType === "single";

                        return (
                          <Pressable
                            key={opt}
                            style={filterStyles.optionRow}
                            onPress={() =>
                              toggleOption(
                                activeSection.key,
                                opt,
                                activeSection.selectionType,
                              )
                            }
                          >
                            {isSingle ? (
                              <View
                                style={[
                                  filterStyles.radioOuter,
                                  isChecked && filterStyles.radioOuterSelected,
                                ]}
                              >
                                {isChecked && (
                                  <View style={filterStyles.radioInner} />
                                )}
                              </View>
                            ) : (
                              <View
                                style={[
                                  filterStyles.checkbox,
                                  isChecked && filterStyles.checkedBox,
                                ]}
                              >
                                {isChecked && (
                                  <Entypo name="check" size={12} color="#fff" />
                                )}
                              </View>
                            )}

                            <Text style={filterStyles.optionText}>{opt}</Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}

      {/* BOTTOM BAR */}
      <View
        style={[filterStyles.buttonBar, { marginBottom: insets.bottom + 10 }]}
      >
        <Pressable style={filterStyles.clearButton} onPress={handleClearButton}>
          <Text style={filterStyles.clearText}>Clear</Text>
        </Pressable>
        <Pressable style={[filterStyles.nextButton]} onPress={handleSearch}>
           <View style={filterStyles.filterCount}>
                      <Text style={filterStyles.filterCountText}>
                        {displayedMoreFiltersBadgeCount}
                      </Text>
                    </View>
          <Text style={filterStyles.nextText}>
            Search
            {/* {step === TOTAL_STEPS ? "Search" : "Next"} */}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default AgriculturalFilters;
