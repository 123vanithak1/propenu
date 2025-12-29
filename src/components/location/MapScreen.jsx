import { WebView } from "react-native-webview";
import { View } from "react-native";

export default function MapScreen() {
  return (
    <View style={{ flex: 1,}}>
      <WebView
        originWhitelist={["*"]}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={{ flex: 1 }}
        source={{
          html: `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body, #map {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  <div id="map"></div>

  <script>
    var map = L.map('map').setView([17.385, 78.4867], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    L.marker([17.385, 78.4867]).addTo(map)
      // .bindPopup('Property Location')
      .openPopup();
  </script>
</body>
</html>
          `,
        }}
      />
    </View>
  );
}
