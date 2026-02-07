import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { setProfileField } from "../../redux/slice/PostPropertySlice";
import InputField from "../ui/InputField";

export default function PricingDetails({ propertyType, data, fieldErrors }) {
  const dispatch = useDispatch();

  const isLandLike = propertyType === "land" || propertyType === "agricultural";

  const areaKey =
    propertyType === "agricultural"
      ? "totalArea"
      : propertyType === "land"
        ? "plotArea"
        : "carpetArea";

  const areaLabel =
    propertyType === "agricultural"
      ? "Total Area (sq ft)"
      : propertyType === "land"
        ? "Plot Area (sq ft)"
        : "Carpet Area (sq ft)";

  const extraFieldKey = isLandLike ? "roadWidth" : "builtUpArea";

  const extraFieldLabel = isLandLike
    ? "Road Width (ft)"
    : "Built-up Area (sq ft)";

  /*  AUTO CALCULATE PRICE / SQ FT */
  useEffect(() => {
    const price = Number(data.price) || Number(data.expectedPrice);
    const area = Number(data[areaKey]);

    if (price > 0 && area > 0) {
      const pricePerSqft = String(Math.round(price / area));

      if (pricePerSqft !== data.pricePerSqft) {
        dispatch(
          setProfileField({
            propertyType,
            key: "pricePerSqft",
            value: pricePerSqft,
          }),
        );
      }
    } else if (data.pricePerSqft) {
      dispatch(
        setProfileField({
          propertyType,
          key: "pricePerSqft",
          value: "",
        }),
      );
    }
  }, [
    data.price,
    data.expectedPrice,
    data.pricePerSqft,
    data[areaKey],
    areaKey,
    propertyType,
    dispatch,
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Total Price */}
        <View style={styles.field}>
          <InputField
            label="Total Price"
            value={data.price || ""}
            placeholder="e.g. 75,00,000"
            error={fieldErrors?.price?.[0]}
            keyboardType="numeric"
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType,
                  key: "price",
                  value: value.replace(/\D/g, ""),
                }),
              )
            }
          />
        </View>

        {/* Area */}
        <View style={styles.field}>
          <InputField
            label={areaLabel}
            value={data[areaKey] || ""}
            placeholder="e.g. 1200"
            error={fieldErrors?.[areaKey]?.[0]}
            keyboardType="numeric"
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType,
                  key: areaKey,
                  value: value.replace(/\D/g, ""),
                }),
              )
            }
          />
        </View>
      </View>
      <View style={styles.row}>
        {/* Price / sq ft */}
        <View style={styles.field}>
          <InputField
            label="Price / sq ft"
            value={data.pricePerSqft || ""}
            placeholder="Auto calculated"
            editable={false}
            disabled
          />
        </View>

        {/* Built-up Area / Road Width */}
        <View style={styles.field}>
          <InputField
            label={extraFieldLabel}
            value={data[extraFieldKey] || ""}
            placeholder={isLandLike ? "e.g. 40" : "Optional"}
            error={fieldErrors?.[extraFieldKey]?.[0]}
            keyboardType="numeric"
            onChange={(value) =>
              dispatch(
                setProfileField({
                  propertyType,
                  key: extraFieldKey,
                  value: value.replace(/\D/g, ""),
                }),
              )
            }
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    // gap: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  field: {
    width: "48%",
  },
  helperText: {
    // marginTop: 4,
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
  },
});
