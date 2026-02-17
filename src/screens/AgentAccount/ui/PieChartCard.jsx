import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const COLORS = ["#27AE60", "#6366F1", "#F59E0B", "#EF4444"];

const PieChartCard = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No data available</Text>
      </View>
    );
  }

  // Convert to chart-kit format
  const chartData = data.map((item, index) => ({
    name: item.name,
    population: item.value,
    color: COLORS[index % COLORS.length],
    legendFontColor: "#374151",
    legendFontSize: 12,
  }));

  return (
    <View style={styles.container}>
      <PieChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          color: () => `#000`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        hasLegend={true}
        center={[0, 0]}
        doughnut  
      />
    </View>
  );
};

export default PieChartCard;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  center: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#9CA3AF",
  },
});