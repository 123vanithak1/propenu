import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setBaseField } from "../../redux/slice/PostPropertySlice";

const NearbyLocationSearch = () => {
  const dispatch = useDispatch();

  const nearbyPlaces =
    useSelector((state) => state.postProperty?.nearbyPlaces) || [];

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Search nearby places using Nominatim (OSM)
  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    const searchPlaces = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&limit=5`,
          {
            signal: controller.signal,
            headers: {
              "Accept-Language": "en",
              "User-Agent": "your-app-name", // 👈 important for Nominatim
            },
          }
        );

        const data = await res.json();
        setResults(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Nearby search error", err);
        }
      } finally {
        setLoading(false);
      }
    };

    searchPlaces();
    return () => controller.abort();
  }, [query]);

  // ➕ Add nearby place
  const addPlace = (place) => {
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
      })
    );

    setQuery("");
    setResults([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nearby places (search)</Text>

      <TextInput
        style={styles.input}
        placeholder="Search nearby place (e.g. Metro station)"
        placeholderTextColor={"#9ca3af"}
        value={query}
        onChangeText={setQuery}
      />

      {loading && <ActivityIndicator size="small" color="#6b7280" />}

      {/* Search Results */}
      {results.length > 0 && (
        <View style={styles.resultBox}>
          <FlatList
            data={results}
            keyExtractor={(_, index) => index.toString()}
            keyboardShouldPersistTaps="handled"
            // nestedScrollEnabled
             scrollEnabled={false}
            renderItem={({ item }) => (
              <Pressable
                style={styles.resultItem}
                onPress={() => addPlace(item)}
              >
                <Text style={styles.resultText}>{item.display_name}</Text>
              </Pressable>
            )}
          />
        </View>
      )}

      {/* Selected nearby places */}
      {nearbyPlaces.length > 0 && (
        <View style={styles.selectedBox}>
          {nearbyPlaces.map((p, i) => (
            <Text key={i} style={styles.selectedText}>
              • {p.name}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

export default NearbyLocationSearch;
const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  resultBox: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    maxHeight: 180,
    backgroundColor: "#fff",
  },
  resultItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  resultText: {
    fontSize: 13,
    color: "#111827",
  },
  selectedBox: {
    marginTop: 8,
  },
  selectedText: {
    fontSize: 13,
    color: "#374151",
  },
});
