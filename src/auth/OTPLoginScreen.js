import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet,Pressable } from 'react-native';
import { apiService } from '../services/apiService';
import useDimensions from "../components/CustomHooks/UseDimension";

export default function OTPLoginScreen({ route, navigation }) {
  const { email, username } = route.params; // coming from login screen

  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const { width, height, isLandscape } = useDimensions();

  const inputs = useRef([]);

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');

    if (otpValue.length !== 4) {
      alert('Please enter 4 digit OTP');
      return;
    }

    try {
      setLoading(true);

      const response = await apiService.verifyOtp({
        name: username,
        email,
        otp: otpValue,
      });

      console.log('OTP verified:', response);

      alert('Login successful');
      navigation.navigate('Profile'); 
    } catch (error) {
      console.log('OTP error:', error);
      alert('Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm OTP</Text>
      <Text style={styles.subtitle}>
        OTP sent to {email}
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => (inputs.current[index] = ref)}
            style={styles.otpInput}
            value={digit}
            onChangeText={value => handleOtpChange(value, index)}
            keyboardType="number-pad"
            maxLength={1}
          />
        ))}
      </View>
  <Pressable
          style={({ pressed }) => [
            styles.loginButton,
            { width: isLandscape ? width * 0.3 : width * 0.65 },
            pressed && { opacity: 0.8 },
          ]}
          onPress={handleVerifyOtp}
        >
          <Text style={styles.loginText}>{loading ? 'Verifying...' : 'Verify OTP'}</Text>
        </Pressable>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color:"#0e49a1ff",
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  otpInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16,
    textAlign: 'center',
  },
   loginButton: {
    alignSelf: "center",
    backgroundColor: "#2785e9ff",
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 10,
  },
  loginText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
