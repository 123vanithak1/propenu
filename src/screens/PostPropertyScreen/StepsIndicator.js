
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const StepIndicator = ({ steps = [], currentStep = 0 }) => {
  if (!steps.length) return null;

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isUpcoming = index > currentStep;

        return (
          <View key={index} style={styles.stepWrapper}>
            {/* Circle */}
            <View
              style={[
                styles.outerCircle,
                isCompleted && styles.completedOuter,
                isCurrent && styles.currentOuter,
                isUpcoming && styles.upcomingOuter,
              ]}
            >
              <View
                style={[
                  styles.innerCircle,
                  isCompleted && styles.completedInner,
                  isCurrent && styles.currentInner,
                  isUpcoming && styles.upcomingInner,
                ]}
              />
            </View>

            {/* Label */}
            <Text
              style={[
                styles.label,
                isCompleted && styles.completedText,
                isCurrent && styles.currentText,
                isUpcoming && styles.upcomingText,
              ]}
              numberOfLines={2}
            >
              {step}
            </Text>

            {/* Line */}
            {index !== steps.length - 1 && (
              <View
                style={[
                  styles.line,
                  index < currentStep && styles.completedLine,
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

export default StepIndicator;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
    paddingHorizontal: 10,
  },

  stepWrapper: {
    alignItems: "center",
    flex: 1,
  },

  /* OUTER CIRCLE */
  outerCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "#000",
  },

  completedOuter: {
    borderColor: "#27AE60",
  },

  currentOuter: {
    borderColor: "#F39C12",
  },

  upcomingOuter: {
    borderColor: "#999",
  },

  /* INNER CIRCLE */
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#000",
  },

  completedInner: {
    backgroundColor: "#27AE60",
  },

  currentInner: {
    backgroundColor: "#F39C12",
  },

  upcomingInner: {
    backgroundColor: "#999",
  },

  /* LABEL */
  label: {
    fontSize: 11,
    marginTop: 6,
    textAlign: "center",
    color: "#999",
  },

  completedText: {
    color: "#27AE60",
    fontWeight: "600",
  },

  currentText: {
    color: "#F39C12",
    fontWeight: "600",
  },

  upcomingText: {
    color: "#999",
  },

  /* LINE */
  line: {
    position: "absolute",
    top: 11,
    right: "-50%",
    width: "100%",
    height: 2,
    backgroundColor: "#999",
    zIndex: -1,
  },

  completedLine: {
    backgroundColor: "#27AE60",
  },
});
