import {CommonActions} from '@react-navigation/native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Dialog, Text, useTheme} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../context/AuthProvider';
import {UserContext} from '../context/UserProvider';

export default function Preload({navigation}: any) {
  const theme = useTheme();
  const {setUserAuth, recuperaCredencialdaCache, SignIn} = useContext<any>(AuthContext);
  const {getUser} = useContext<any>(UserContext);
  const [dialogVisivel, setDialogVisivel] = useState(false);
  const [mensagemErro] = useState('Você precisa verificar seu email para continuar');

  const irParaSignIn = useCallback(() => {
    setDialogVisivel(false);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'SignIn'}],
      }),
    );
  }, [navigation]);

  const buscaUsuario = useCallback(async () => {
    const usuario = await getUser();
    if (usuario) {
      setUserAuth(usuario);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'AppStack'}],
        }),
      );
    }
  }, [getUser, navigation, setUserAuth]);

  const logar = useCallback(async () => {
    const credencial = await recuperaCredencialdaCache();

    if (credencial && credencial !== 'null') {
      try {
        const mensagem = await SignIn(credencial);

        if (mensagem === 'ok') {
          await buscaUsuario();
        } else {
          irParaSignIn();
        }
      } catch (error) {
        console.error('Erro no SignIn:', error);
        irParaSignIn();
      }
    } else {
      irParaSignIn();
    }
  }, [recuperaCredencialdaCache, SignIn, buscaUsuario, irParaSignIn]);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async authUser => {
      if (authUser) {
        if (authUser.emailVerified) {
          await buscaUsuario();
        } else {
          setDialogVisivel(true);
        }
      } else {
        await logar();
      }
    });

    return () => unsubscribe();
  }, [buscaUsuario, logar]);

  return (
    <View style={{...styles.container, backgroundColor: theme.colors.background}}>
      <Image
        style={styles.imagem}
        source={require('../assets/images/LOGO.png')}
        accessibilityLabel="logo do app"
      />
      <Dialog visible={dialogVisivel} onDismiss={irParaSignIn}>
        <Dialog.Icon icon="alert-circle-outline" size={60} />
        <Dialog.Title style={styles.textDialog}>Erro</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.textDialog} variant="bodyLarge">
            {mensagemErro}
          </Text>
        </Dialog.Content>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagem: {
    width: 250,
    height: 250,
  },
  textDialog: {
    textAlign: 'center',
  },
});
