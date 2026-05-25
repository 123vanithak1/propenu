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
  formatBudget,
  commercialMoreFilterSections,
} from "../../../data/constants";
import {
  setCommercialFilter,
  resetCommercialFilters,
} from "../../../redux/slice/FilterSlice";
import Dropdownui from "../../../components/ui/DropDownUI";
import { useAppSelector } from "../../../redux/store/store";
import { ToastInfo, ToastSuccess } from "../../../utils/Toast";
import filterStyles from "./filterStyles";

const CommercialFilters = () => {
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

  const { category } = useAppSelector((s) => s.filters);
  const { selectedCity } = useCity();

  const { minBudget, maxBudget, commercial, listingTypeValue } = filtersState;
  const { postedBy, commercialType,locality } = commercial;

  const inputRef = useRef(null);
  const TOTAL_STEPS = 3;
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
  console.log("commercial filters :", commercial);

  /* -------------------- BUDGET -------------------- */
  const BUDGET_MIN = 5;
  const BUDGET_MAX = 5000;
  const BUDGET_STEP = 5;

  const CARPET_MIN = 100;
  const CARPET_MAX = 10000;

  const budgetOptions = [
    5, 10, 20, 30, 50, 75, 100, 150, 200, 300, 400, 500, 750, 1000, 2000, 3000,
    4000, 5000,
  ];

  const carpetOptions = [
    100, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 5000, 7500, 10000,
  ];
  const [budgetRange, setBudgetRange] = useState([
    minBudget || BUDGET_MIN,
    maxBudget || BUDGET_MAX,
  ]);

  const budgetLabel =
    minBudget === BUDGET_MIN && maxBudget === BUDGET_MAX
      ? "Budget"
      : `${formatBudget(minBudget)} - ${formatBudget(maxBudget)}`;

  const rightPanelRef = useRef(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [carpetRange, setCarpetRange] = useState([CARPET_MIN, CARPET_MAX]);

  // Map display labels to camelCase property names
  const keyMapping = {
    "Commercial Type": "commercialType",
    "Commercial Sub Type": "commercialSubType",
    "Transaction Type": "transactionType",
    "Construction Status": "constructionStatus",
    "Built-up Area": "builtUpArea",
    "Carpet Area": "carpetArea",
    "Floor Number": "floorNumber",
    "Total Floors": "totalFloors",
    "Furnishing Status": "furnishingStatus",
    Pantry: "pantry",
    "Power Capacity": "powerCapacity",
    Parking: "parking",
    "Fire Safety": "fireSafety",
    "Flooring Type": "flooringType",
    "Wall Finish": "wallFinish",
    "Tenant Available": "tenantAvailable",
    "Banks Approved": "banksApproved",
    "Price Negotiable": "priceNegotiable",
    "Verified Properties": "verifiedProperties",
    "Posted Since": "postedSince",
    "Posted By": "postedBy",
  };

  const COMMERCIAL_SUBTYPE_MAP = {
    office: ["BARE SHELL", "WARM SHELL", "BUSINESS CENTER"],
    retail: ["HIGH STREET-SHOP", "MALL SHOP", "KIOSK", "FOOD COURT-UNIT"],
    shop: ["HIGH STREET-SHOP", "SHUTTER SHOP", "MALL SHOP"],
    showroom: ["HIGH STREET-SHOP", "SHOWROOM SPACE"],
    warehouse: ["WAREHOUSE GODOWN", "LOGISTICS HUB", "COLD STORAGE"],
    industrial: ["INDUSTRIAL SHED"],
    coworking: ["COWORKING DEDICATED-DESK", "COWORKING HOT-DESK"],
    restaurant: ["FOOD COURT-UNIT"],
    clinic: ["CLINIC SPACE"],
  };

  const selectedTypes = commercial?.commercialType || [];

  const subTypes = [
    ...new Set(
      selectedTypes.flatMap(
        (type) => COMMERCIAL_SUBTYPE_MAP[type?.toLowerCase()] || [],
      ),
    ),
  ];

  /* -------------------- POSTED BY -------------------- */

  const postedByOptions = ["Owners", "Agents", "Builders"];

   const getSelectedMoreFiltersCount = () => {
    let count = 0;

    Object.values(keyMapping).forEach((key) => {
      const value = commercial[key];

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
        setCommercialFilter({
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
    commercialMoreFilterSections[0]?.key,
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
    const currentValue = commercial[mappedKey];

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
      setCommercialFilter({
        key: mappedKey,
        value:
          selectionType === "multiple"
            ? toggleArrayValue(currentValue || [], option)
            : option,
      }),
    );
  };

  const handleSearch = () => {
    console.log("Searching with commercial filters...");
    navigation.navigate("PropertyList");
  };
  const handleClearButton = () => {
    setLocations([]);
    setLocationInput("");
    setBudgetRange([BUDGET_MIN, BUDGET_MAX]);
    setSelectedOptions({});
    setVerifiedOnly(false);
    setCarpetRange([CARPET_MIN, CARPET_MAX]);
    dispatch(resetCommercialFilters());
    ToastInfo("All filters have been cleared.");
  };

  const activeSection = commercialMoreFilterSections.find(
    (section) => section.key === activeFilter,
  );

  return (
    <View style={filterStyles.container}>
      {/* <FilterBar /> */}

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
                      setCommercialFilter({
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

      <View style={filterStyles.content}>
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

        {/* <Text style={filterStyles.subTitle}>Property Type</Text>
        <View style={filterStyles.toggleContainer}>
          {TypeOptions.map((opt) => {
            const isActive = opt === commercial?.commercialType;

            return (
              <Pressable
                key={opt}
                onPress={() => {
                  dispatch(
                    setCommercialFilter({
                      key: "commercialType",
                      value: opt,
                    }),
                  );
                }}
                style={[
                  filterStyles.bhkData,
                  isActive && filterStyles.activeChip,
                ]}
              >
                <Text
                  style={[
                    filterStyles.labelText,
                    isActive && filterStyles.activeChipText,
                  ]}
                >
                  {opt}
                </Text>
              </Pressable>
            );
          })}
        </View> */}

        {/*<View style={filterStyles.budget}>
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
                  setCommercialFilter({
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
              <Text style={filterStyles.labelText}>{item}</Text>
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
              {commercialMoreFilterSections.map((section) => (
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
                  ) : activeSection.key === "Carpet Area" ? (
                    <View style={filterStyles.budgetArea}>
                      <View style={filterStyles.minMaxBudget}>
                        <Dropdownui
                          label="Minimum"
                          value={carpetRange[0]}
                          options={carpetOptions.map((t) => ({
                            label: ` Min ${t} Sqft`,
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
                            label: `Max ${t} Sqft`,
                            value: t,
                          }))}
                          onChange={(value) =>
                            setCarpetRange([carpetRange[0], value])
                          }
                        />
                      </View>
                    </View>
                  ) : activeSection.key === "Commercial Sub Type" ? (
                    <View>
                      {selectedTypes.length > 0 ? (
                        subTypes.map((item) => {
                          const isChecked =
                            commercial?.commercialSubType?.includes(item);

                          return (
                            <Pressable
                              key={item}
                              style={filterStyles.optionRow}
                              onPress={() =>
                                toggleOption(
                                  activeSection.key,
                                  item,
                                  activeSection.selectionType,
                                )
                              }
                            >
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

                              <Text style={filterStyles.optionText}>
                                {item}
                              </Text>
                            </Pressable>
                          );
                        })
                      ) : (
                        <Text style={filterStyles.optionText}>
                          Select Commercial Type first
                        </Text>
                      )}
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

export default CommercialFilters;
