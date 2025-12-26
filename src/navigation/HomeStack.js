import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import HomeScreen  from "../screens/HomeScreen/HomeScreen";
import ShortListedScreen from '../screens/HomeScreen/ShortListedScreen';


const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
      <Stack.Screen name="Shortlisted" component={ShortListedScreen} />
    </Stack.Navigator>
  );
}
