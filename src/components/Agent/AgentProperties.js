import { useEffect, useState } from "react";
import { View,Text,StyleSheet, FlatList } from "react-native";
import { apiService } from "../../services/apiService";
import AgentCard from "./AgentCard";

const AgentProperties = ()=>{
  const [details, setDetails] = useState([]);

    useEffect(()=>{
     const fetchAgentData  = async() =>{
        try {
             const response = await apiService.agent()
        if (response.status === 200){
            setDetails(response.data.items)
        }
        } catch (error) {
            console.log("Error occured in agent api", error)
        }
     }
     fetchAgentData()
    },[])

    return (

    <View style={styles.container}>
        <Text style={styles.title}>Agent Connect</Text>
        <Text>Trusted professionals guiding your property journey</Text>
        <FlatList 
        data={details}
        keyExtractor={(item) => item._id}
         horizontal      
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <AgentCard details={item} /> }
        />
    </View>
 )
}
const styles = StyleSheet.create({
     container: {
        padding: 10,
        // backgroundColor: "#f9f9f9",
    },
       title: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
    },
})
export default AgentProperties;