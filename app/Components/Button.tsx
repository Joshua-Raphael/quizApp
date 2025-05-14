import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { elevate } from 'react-native-elevate';
import he from 'he';

interface ButtonProps {
  onPress: () => void;
  answer: string;
  disabled: boolean;
  correct: boolean;
  key: number;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    // Android elevation
    elevation: 6,
  },
  label: {
    fontSize: 16,
    fontFamily: 'OpenSansSemiBold',
    color: '#006996',
    textTransform: 'capitalize',
    flex: 1,
    textAlign: 'center',
  },
});

const Button = ({ answer, onPress, correct, disabled }: ButtonProps) => {
  return (
    <RectButton
      {...{ onPress }}
      enabled={!disabled}
      style={[
        styles.container,
        {
          backgroundColor: disabled ? '#eee' : '#fff',
          borderColor: correct ? 'green' : '#ddd',
          borderWidth: correct ? 2 : 1,
        },
        elevate(6),
      ]}
    >
      <Text style={[styles.label, correct && { color: 'green' }]}>
        {he.decode(answer)}
      </Text>
    </RectButton>
  );
};

Button.defaultProps = { variant: 'default' };

export default Button;
