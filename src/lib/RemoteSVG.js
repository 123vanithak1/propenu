import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { SvgXml } from "react-native-svg";

const RemoteSvg = ({ url, width = 50, height = 50 }) => {
  const [svgXml, setSvgXml] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) return;

    fetch(url)
      .then(res => res.text()) // fetch SVG as text
      .then(xml => {
        setSvgXml(xml);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load SVG:", err);
        setLoading(false);
      });
  }, [url]);

  if (!svgXml) return <View style={{ width, height, backgroundColor: "#eee" }} />;

  return <SvgXml xml={svgXml} width={width} height={height} />;
};

export default RemoteSvg;
