import { View, Text, FlatList, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { apiService } from "../../services/apiService";
import HighLightCard from "./HighLightCard";

const HighLightProjects = () => {
  const [projects, setProjects] = useState([]);     
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await apiService.HighlightProjects();
                if (response.status === 200) {
                    const data = response.data.items;

                    setProjects(data);
                }   
            } catch (error) {
                console.log("Highlight Projects Error:", error);
            }
        };


        fetchProjects();

    }, []);
    return (
    <View style={styles.container}>
        <Text style={styles.title}>Highlight Projects</Text>
        <Text style={styles.subtitle}>Explore properties across locations</Text>
        <FlatList

            data={projects}
            keyExtractor={(item) => item._id}
            horizontal      
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <HighLightCard details={item} /> }
        />
    </View>
    );
};
const styles = StyleSheet.create({
    container: {
        padding: 10,
        // backgroundColor: "#f9f9f9",
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        // marginBottom: 10,
    },
 subtitle:{
    fontSize:12,
    color:"#8f8d87ff",
    marginBottom:8,
    marginTop:2,
  }


})
export default HighLightProjects;
