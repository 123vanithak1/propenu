import { Pressable, Text, StyleSheet } from "react-native";
import useDimensions from "./CustomHooks/UseDimension";

const Button = ({ title }) => {
  const { width, height, isLandscape } = useDimensions();

  return (
    <Pressable
      style={[
        styles.buttonHolder,
        { width: width * 0.6 },
      ]}
    >
      <Text style={styles.btnText}>{title}</Text>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  buttonHolder: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    paddingVertical: 10,
    backgroundColor: "#2785e9",
    borderRadius: 7,
  },
  btnText: {
    color: "white",
    fontWeight: 600,
  },
});
export default Button;
