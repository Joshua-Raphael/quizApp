import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useRouter } from 'expo-router';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('../Components/login'); // Redirect to login screen after logout
    } catch (error: any) {
      Alert.alert('Logout Error', error.message);
    }
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.button}>
      <Text style={styles.text}>Logout</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 6,
    position: 'absolute',
    top: 25,
    right: 20,
    zIndex: 999,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
