import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';

export default function RecuperarSenha() {
  return (
    <View style={styles.container}>
      <Text variant="labelMedium">Você está na tela RecuperarSenha</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
