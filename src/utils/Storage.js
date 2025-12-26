import AsyncStorage from "@react-native-async-storage/async-storage";


export const setItem = async (key, value) => {
  try {
    const jsonValue =
      typeof value === "string" ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error("AsyncStorage setItem error:", error);
  }
};


export const getItem = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("AsyncStorage getItem error:", error);
    return null;
  }
};


export const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("AsyncStorage removeItem error:", error);
  }
};


export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error("AsyncStorage clear error:", error);
  }
};
