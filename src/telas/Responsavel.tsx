import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Avatar, useTheme} from 'react-native-paper';
import {UserContext} from '../context/UserProvider';

export default function Responsavel() {
  const {user} = useContext(UserContext);
  const theme = useTheme(); // Hook para acessar o tema

  return (
    <View style={styles.container}>
      <Avatar.Icon
        size={80}
        icon="account-circle"
        style={[styles.avatar, {backgroundColor: theme.colors.primary}]}
      />
      <Text style={styles.title} variant="headlineSmall">
        Bem-vindo, {user?.nome || 'Responsável'}!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 20,
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
  },
});
