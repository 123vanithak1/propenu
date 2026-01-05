import AsyncStorage from "@react-native-async-storage/async-storage";

export const setItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(
      String(key),
      JSON.stringify(value)
    );
  } catch (error) {
    console.error("AsyncStorage setItem error:", error);
  }
};

export const getItem = async (key) => {
  if (!key) return null;

  try {
    const value = await AsyncStorage.getItem(String(key));
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("AsyncStorage getItem error:", error);
    return null;
  }
};

export const removeItem = async (key) => {
  if (!key) return;

  try {
    await AsyncStorage.removeItem(String(key));
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
