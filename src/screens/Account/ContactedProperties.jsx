import {View, Text, FlatList, StyleSheet} from 'react-native';
import {useEffect, useState} from 'react';
import {userServices} from '../../services/userServices';
import * as Keychain from 'react-native-keychain';   

const ContactedProperties = () => {

  const [contactedProperties, setContactedProperties] = useState(null);         

    const fetchContactedProperties = async () => {
        try {
            const credentials = await Keychain.getGenericPassword();
            if (!credentials) {
                console.log("No token found in keychain");
                return;
            }

            const token = credentials.password;
            const response = await userServices.getContactedProperties(token);
            if (response?.status === 200) {
                setContactedProperties(response?.data?.data);
            }
        } catch (error) {


            console.log("Error when getting contacted properties:", error);
        }       
    };
    useEffect(() => {
        fetchContactedProperties();
    }, []);

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {contactedProperties?.length > 0 ? (
                <FlatList
                    data={contactedProperties}

                    keyExtractor={(item) => item._id}
                    renderItem={({item}) => (
                        <View style={styles.propertyCard}>
                            <Text style={styles.propertyTitle}>{item.title}</Text>
                            <Text style={styles.propertyDetails}>{item.details}</Text>
                        </View>
                    )}
                />
            ) : (
                <Text>No contacted properties available</Text>
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    propertyCard: {
        backgroundColor: '#f9f9f9',

        padding: 16,
        marginVertical: 8,
        borderRadius: 8,    
        width: '90%',

        elevation: 2,


    },    propertyTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    propertyDetails: {  
        fontSize: 14,
        color: '#555',
    },
});
export default ContactedProperties;         