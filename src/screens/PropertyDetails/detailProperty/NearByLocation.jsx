import { WebView } from "react-native-webview";
import { View } from "react-native";
import { useState, useRef } from "react";

export default function NearByLocations({ nearbyPlaces = [], location }) {
  const webRef = useRef(null);

  // Nearby place markers
  const nearbyPoints = Array.isArray(nearbyPlaces)
    ? nearbyPlaces
        .filter(
          (p) => Array.isArray(p.coordinates) && p.coordinates.length === 2
        )
        .map((p) => ({
          lng: p.coordinates[0],
          lat: p.coordinates[1],
          label: p.name,
          type: "nearby", // 🔑 marker type
        }))
    : [];

  // Property location marker
  const propertyPoint =
    Array.isArray(location?.coordinates) &&
    location.coordinates.length === 2
      ? {
          lng: location.coordinates[0],
          lat: location.coordinates[1],
          label: "Property Location",
          type: "property", // 🔑 different marker
        }
      : null;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webRef}
        source={require("../../../../assets/map.html")}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        onLoadEnd={() => {
          webRef.current?.postMessage(
            JSON.stringify({
              mode: "view",
              points: propertyPoint
                ? [propertyPoint, ...nearbyPoints]
                : nearbyPoints,
            })
          );
        }}
      />
    </View>
  );
}

