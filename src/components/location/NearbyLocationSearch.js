// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   Pressable,
//   ActivityIndicator,
//   StyleSheet,
// } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { setBaseField } from "../../redux/slice/PostPropertySlice";

// const NearbyLocationSearch = () => {
//   const dispatch = useDispatch();

//   const nearbyPlaces =
//     useSelector((state) => state.postProperty?.nearbyPlaces) || [];

//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // 🔍 Search nearby places using Nominatim (OSM)
//   useEffect(() => {
//     if (query.length < 3) {
//       setResults([]);
//       return;
//     }

//     const controller = new AbortController();

//     const searchPlaces = async () => {
//       try {
//         setLoading(true);

//         const res = await fetch(
//           `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//             query
//           )}&limit=5`,
//           {
//             signal: controller.signal,
//             headers: {
//               "Accept-Language": "en",
//               "User-Agent": "your-app-name", // 👈 important for Nominatim
//             },
//           }
//         );

//         const data = await res.json();
//         setResults(data);
//       } catch (err) {
//         if (err.name !== "AbortError") {
//           console.error("Nearby search error", err);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     searchPlaces();
//     return () => controller.abort();
//   }, [query]);

//   // ➕ Add nearby place
//   const addPlace = (place) => {
//     dispatch(
//       setBaseField({
//         key: "nearbyPlaces",
//         value: [
//           ...nearbyPlaces,
//           {
//             name: place.display_name,
//             coordinates: [Number(place.lon), Number(place.lat)],
//             order: nearbyPlaces.length,
//           },
//         ],
//       })
//     );

//     setQuery("");
//     setResults([]);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Nearby places (search)</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Search nearby place (e.g. Metro station)"
//         placeholderTextColor={"#9ca3af"}
//         value={query}
//         onChangeText={setQuery}
//       />

//       {loading && <ActivityIndicator size="small" color="#6b7280" />}

//       {/* Search Results */}
//       {results.length > 0 && (
//         <View style={styles.resultBox}>
//           <FlatList
//             data={results}
//             keyExtractor={(_, index) => index.toString()}
//             keyboardShouldPersistTaps="handled"
//             // nestedScrollEnabled
//              scrollEnabled={false}
//             renderItem={({ item }) => (
//               <Pressable
//                 style={styles.resultItem}
//                 onPress={() => addPlace(item)}
//               >
//                 <Text style={styles.resultText}>{item.display_name}</Text>
//               </Pressable>
//             )}
//           />
//         </View>
//       )}

//       {/* Selected nearby places */}
//       {nearbyPlaces.length > 0 && (
//         <View style={styles.selectedBox}>
//           {nearbyPlaces.map((p, i) => (
//             <Text key={i} style={styles.selectedText}>
//               • {p.name}
//             </Text>
//           ))}
//         </View>
//       )}
//     </View>
//   );
// };

// export default NearbyLocationSearch;
// const styles = StyleSheet.create({
//   container: {
//     marginTop: 12,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#374151",
//     marginBottom: 6,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#d1d5db",
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     fontSize: 14,
//     backgroundColor: "#fff",
//   },
//   resultBox: {
//     marginTop: 6,
//     borderWidth: 1,
//     borderColor: "#e5e7eb",
//     borderRadius: 8,
//     maxHeight: 180,
//     backgroundColor: "#fff",
//   },
//   resultItem: {
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f3f4f6",
//   },
//   resultText: {
//     fontSize: 13,
//     color: "#111827",
//   },
//   selectedBox: {
//     marginTop: 8,
//   },
//   selectedText: {
//     fontSize: 13,
//     color: "#374151",
//   },
// });

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setBaseField } from "../../redux/slice/PostPropertySlice";
import { Ionicons } from "@expo/vector-icons";

const NearbyLocationSearch = ({ city, state }) => {
  const dispatch = useDispatch();

  const nearbyPlaces =
    useSelector((s) => s.postProperty.base.nearbyPlaces) || [];

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  /* 🔍 Search */
  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    const searchPlaces = async () => {
      try {
        setLoading(true);
        const fullQuery = [query, city, state].filter(Boolean).join(", ");

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            fullQuery,
          )}&limit=5`,
          {
            signal: controller.signal,
            headers: {
              "User-Agent": "property-app",
              Accept: "application/json",
            },
          },
        );
        const contentType = res.headers.get("content-type");

        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          console.log("Not JSON →", text);
          throw new Error("API did not return JSON");
        }

        const data = await res.json();
        setResults(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.log("Nearby search error", err);
        }
      } finally {
        setLoading(false);
      }
    };

    searchPlaces();
    return () => controller.abort();
  }, [query, city, state]);

  /* ➕ Add place */
  const addPlace = (place) => {
    if (nearbyPlaces.some((p) => p.name === place.display_name)) return;

    dispatch(
      setBaseField({
        key: "nearbyPlaces",
        value: [
          ...nearbyPlaces,
          {
            name: place.display_name,
            coordinates: [Number(place.lon), Number(place.lat)],
            order: nearbyPlaces.length,
          },
        ],
      }),
    );

    setQuery("");
    setResults([]);
    Keyboard.dismiss();
  };

  /* ❌ Remove place */
  const removePlace = (index) => {
    const updated = nearbyPlaces.filter((_, i) => i !== index);

    dispatch(
      setBaseField({
        key: "nearbyPlaces",
        value: updated,
      }),
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => setResults([])}>
      <View style={styles.container}>
        {/* Label */}
        <View style={styles.labelRow}>
          <Ionicons name="location-outline" size={17} color="#16a34a" />
          <Text style={styles.label}>Nearby Landmarks</Text>
        </View>

        {/* Input */}
        <View style={styles.inputWrapper}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#888"
            style={styles.leftIcon}
          />

          <TextInput
            style={styles.input}
            placeholderTextColor="gray"
            placeholder="Search nearby place (e.g. Metro, Hospital)"
            value={query}
            onChangeText={setQuery}
          />

          {loading && <ActivityIndicator size="small" style={styles.loader} />}

          {query.length > 0 && !loading && (
            <Pressable onPress={() => setQuery("")} style={styles.clearBtn}>
              <Ionicons name="close" size={18} color="#555" />
            </Pressable>
          )}
        </View>

        {/* Dropdown */}
        {results.length > 0 && (
          <View style={styles.dropdown}>
            {results.map((item, index) => (
              <Pressable
                key={index}
                style={styles.resultItem}
                onPress={() => addPlace(item)}
              >
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.resultText} numberOfLines={2}>
                  {item.display_name}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Selected tags */}
        <View style={styles.tagsContainer}>
          {nearbyPlaces.map((p, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText} numberOfLines={1}>
                {p.name.split(",")[0]}
              </Text>
              <Pressable onPress={() => removePlace(i)}>
                <Ionicons name="close" size={14} color="#166534" />
              </Pressable>
            </View>
          ))}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NearbyLocationSearch;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 10,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 6,
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  leftIcon: {
    position: "absolute",
    left: 10,
    zIndex: 1,
  },
  input: {
    paddingLeft: 35,
    paddingRight: 35,
    height: 44,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    backgroundColor: "white",
  },
  loader: {
    position: "absolute",
    right: 10,
  },
  clearBtn: {
    position: "absolute",
    right: 10,
  },
  dropdown: {
    marginTop: 6,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    // maxHeight: 200,
  },
  resultItem: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
  },
  resultText: {
    flex: 1,
    fontSize: 13,
    color: "#111827",
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dcfce7",
    paddingLeft: 10,
    paddingRight: 6,
    paddingVertical: 5,
    borderRadius: 20,
    maxWidth: 160,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: "#166534",
    marginRight: 4,
    flexShrink: 1,
  },
});
