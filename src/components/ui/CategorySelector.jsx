import { View, Text, Pressable, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../redux/store/store";
import { setCategory } from "../../redux/slice/FilterSlice";

const CATEGORIES = ["Residential", "Commercial", "Land", "Agricultural"];

const CategorySelector = () => {
  const dispatch = useDispatch();
  const { category } = useAppSelector((s) => s.filters);

  return (
    <View>
      <Text style={styles.title}>Property Type</Text>
      <View style={styles.categoryContainer}>
        {CATEGORIES.map((item) => {
          const isSelected = category === item;

          return (
            <Pressable
              key={item}
              onPress={() => dispatch(setCategory(item))}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 5,
                marginRight: 10,
              }}
            >
              {/* RADIO */}
              <View
                style={{
                  height: 16,
                  width: 16,
                  borderRadius: 8,
                  borderWidth: 1.7,
                  borderColor: isSelected ? "#27A361" : "#b9b9b9",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 5,
                }}
              >
                {isSelected && (
                  <View
                    style={{
                      height: 8,
                      width: 8,
                      borderRadius: 4,
                      backgroundColor: "#27A361",
                    }}
                  />
                )}
              </View>

              <Text style={styles.categoryTitle}>{item}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
    // color :"#000"
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: "400",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export default CategorySelector;
