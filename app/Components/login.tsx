import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Animated,
  Easing
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useRouter } from 'expo-router';
import FloatingLabelInput from './FloatingLabelInput';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  const emailAnim = useRef(new Animated.Value(0)).current;
  const passwordAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animateInputs();
  }, []);

  const animateInputs = () => {
    Animated.stagger(100, [
      Animated.timing(emailAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp)
      }),
      Animated.timing(passwordAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp)
      })
    ]).start();
  };

  const validate = () => {
    let isValid = true;

    if (!email.trim()) {
      setEmailError('Email is required.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('../(tabs)/createQuiz');
    } catch (error: any) {
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

      <Animated.View style={{ opacity: emailAnim, transform: [{ translateY: emailAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
      <FloatingLabelInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={emailError}
        autoCapitalize="none"
        keyboardType="email-address"
      />
    </Animated.View>

    <Animated.View style={{ opacity: passwordAnim, transform: [{ translateY: passwordAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
      <FloatingLabelInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        error={passwordError}
        secureTextEntry
      />
    </Animated.View>

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push({ pathname: './signUp' })}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: 10,
    fontSize: 13
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 10,
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16
  },
  link: {
    textAlign: 'center',
    marginTop: 20,
    color: '#007bff',
    fontSize: 14
  }
});
