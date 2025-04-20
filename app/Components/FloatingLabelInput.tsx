// components/FloatingLabelInput.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Animated,
  Easing,
  StyleSheet,
  KeyboardTypeOptions,
  TextStyle,
} from 'react-native';

export default function FloatingLabelInput({
  label,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default' as KeyboardTypeOptions,
  autoCapitalize = 'none' as 'none' | 'sentences' | 'words' | 'characters',
  error,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle: Animated.AnimatedProps<TextStyle> = {
    position: 'absolute',
    left: 12,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [14, -8],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ['#aaa', '#000'],
    }),
    backgroundColor: '#fff',
    paddingHorizontal: 4,
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <View style={styles.inputWrapper}>
        <Animated.Text style={labelStyle}>{label}</Animated.Text>
        <TextInput
          style={[styles.input, error && { borderColor: 'red' }]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    paddingTop: 18,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  error: {
    color: '#e74c3c',
    fontSize: 13,
    marginTop: 4,
  },
});
