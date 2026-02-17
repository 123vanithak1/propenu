import React from "react";
import { View, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const HorizontalBarChart = ({ data }) => {
  // Convert your data to chart format
  const labels = data.map(item => item.name);
  const values = data.map(item => item.value);

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: values,
      },
    ],
  };

  return (
    <View>
      <BarChart
        data={chartData}
        width={screenWidth - 20}
        height={280}
        fromZero
        horizontal={true}   
        showValuesOnTopOfBars
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, // #10B981
          labelColor: () => "#333",
          propsForBackgroundLines: {
            strokeWidth: 0,
          },
        }}
        style={{
          borderRadius: 12,
        }}
      />
    </View>
  );
};

export default HorizontalBarChart;