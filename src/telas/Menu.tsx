/* eslint-disable react/no-unstable-nested-components */
import {CommonActions} from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Dialog, Divider, List, Text, useTheme} from 'react-native-paper';
import {AuthContext} from '../context/AuthProvider';

export default function Menu({navigation}: any) {
  const theme = useTheme();
  const {signOut} = useContext<any>(AuthContext);
  const [dialogVisivel, setDialogVisivel] = useState(false);

  async function sair() {
    if (await signOut()) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'AuthStack'}],
        }),
      );
    } else {
      setDialogVisivel(true);
    }
  }

  return (
    <View style={{...styles.container, backgroundColor: theme.colors.background}}>
      <List.Item
        title="Perfil"
        description="Atualize seu perfil ou exclua sua conta"
        left={() => <List.Icon color={theme.colors.primary} icon="smart-card-outline" />}
        onPress={() => navigation.navigate('Perfil')}
      />
      <Divider />
      <List.Item
        title="Alterar Senha"
        description="Altere sua senha"
        left={() => <List.Icon color={theme.colors.primary} icon="eye-arrow-right-outline" />}
        onPress={() => navigation.navigate('AlteraSenha')}
      />
      <Divider />
      <List.Item
        title="Sair"
        description="Finaliza sua sessão no aplicativo"
        left={() => <List.Icon color={theme.colors.primary} icon="exit-run" />}
        onPress={sair}
      />
      <Dialog
        visible={dialogVisivel}
        onDismiss={() => {
          setDialogVisivel(false);
        }}>
        <Dialog.Icon icon={'alert-circle-outline'} size={60} />
        <Dialog.Title style={styles.textDialog}>'Ops!'</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.textDialog} variant="bodyLarge">
            {`Estamos com problemas para realizar essa operação.\nPor favor,
            contate o administrador.`}
          </Text>
        </Dialog.Content>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  textDialog: {
    textAlign: 'center',
  },
});
