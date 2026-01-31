import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { Provider } from "react-redux";
import { store } from "./src/redux/store/store";
import CityDropdown from "./src/components/ui/CityDropDown";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
          <CityDropdown />
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}
