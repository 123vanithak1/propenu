import { WebView } from "react-native-webview";
import { View } from "react-native";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setBaseField } from "../../redux/slice/PostPropertySlice";

export default function NearByLocations({ nearbyPlaces }) {

  const mapPoints = nearbyPlaces
    .filter((p) => Array.isArray(p.coordinates) && p.coordinates.length === 2)
    .map((p) => ({
      lng: p.coordinates[0],
      lat: p.coordinates[1],
      label: p.name,
    }));
  const webRef = useRef(null);



  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webRef}
        source={require("../../../assets/map.html")}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        onLoadEnd={() => {
          // 🔹 View-only mode
          webRef.current.postMessage(
            JSON.stringify({
              mode: "view",
              points: mapPoints,
            })
          );
        }}
      />
    </View>
  );
}
