import { View, Image,FlatList, Text } from "react-native";
import { StyleSheet } from "react-native";
import SearchBar from "../../components/SearchBar";
import useDimensions from "../../components/CustomHooks/UseDimension";
import HomePageImage from "../../../assets/HomePageImage.png"
import CardHome from "./CardHome";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const HomeScreen =() =>{
    const { width, height, isLandscape } = useDimensions();
    console.log("Dimensions", width, height, isLandscape)
 const HOME_CARDS = [
  {
    id: "buy",
    title: "Buy",
    icon: <MaterialCommunityIcons name="home-plus" size={26} color="#006ac2" />,
    onPress: () => console.log("Buy pressed"),
  },
    {
    id: "rent",
    title: "Rent",
    icon: <MaterialIcons name="add-home" size={26} color="#006ac2" />,
    onPress: () => console.log("Rent pressed"),
  },
   {
    id: "residential",
    title: "Residential",
    icon: <MaterialIcons name="add-home" size={26} color="#006ac2" />,
    onPress: () => console.log("Residential pressed"),
  },
   {
    id: "commercial",
    title: "Commercial",
    icon: <MaterialIcons name="add-home" size={26} color="#006ac2" />,
    onPress: () => console.log("Commercial pressed"),
  },
   {
    id: "land",
    title: "Land",
    icon: <MaterialIcons name="add-home" size={26} color="#006ac2" />,
    onPress: () => console.log("Land pressed"),
  },
   {
    id: "agriculture",
    title: "Agriculture",
    icon: <MaterialIcons name="add-home" size={26} color="#006ac2" />,
    onPress: () => console.log("Agriculture pressed"),
  },
];

 return (
    <View style={styles.home}>
      <Image source={HomePageImage}
       style={{ width: '100%', height: height * 0.3, resizeMode: 'cover',opacity:0.8 }} />
        <View style={styles.searchWrapper}>
        <SearchBar />
         <View style={{marginTop:20}}>
            <Text style={{fontSize:18,fontWeight:"600",color:"#0e49a1ff",marginLeft:10,marginBottom:10}}>Get Started with</Text>
      <FlatList
        data={HOME_CARDS}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        renderItem={({ item }) => (
          <CardHome
            title={item.title}
            icon={item.icon}
            onPress={item.onPress}
          />
        )}
      />
    </View>
    



        </View>
    </View>
 )}

const styles = StyleSheet.create({
    searchWrapper :{
        position:"relative",
        top:-15,

    }
})
export default HomeScreen;