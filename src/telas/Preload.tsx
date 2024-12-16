/* eslint-disable react/no-unstable-nested-components */
import {CommonActions} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Dialog, Text} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../context/AuthProvider';
import {UserContext} from '../context/UserProvider';
// import {Usuario} from '../model/Usuario';

export default function Preload({navigation}: any) {
  const {setUserAuth, recuperaCredencialdaCache, SignIn} = useContext<any>(AuthContext);
  const {getUser} = useContext<any>(UserContext);
  const [dialogVisivel, setDialogVisivel] = useState(false);
  const [mensagemErro] = useState('Você precisa verificar seu email para continuar');

  useEffect(() => {
    // Liga o listener e fica escutando o estado da autenticação no serviço Auth do Firebase
    const unsubscribe = auth().onAuthStateChanged(async authUser => {
      console.log('onAuthStateChanged:', authUser);
      if (authUser) {
        if (authUser.emailVerified) {
          console.log('Email verificado');
          await buscaUsuario();
        } else {
          console.log('Email não verificado');
          setDialogVisivel(true);
        }
      } else {
        console.log('Nenhum usuário autenticado, chamando logar');
        await logar();
      }
    });

    // Ao desmontar
    return () => unsubscribe(); // Desliga o listener
  }, []);

  async function buscaUsuario() {
    const usuario = await getUser();
    if (usuario) {
      console.log('Usuário autenticado:',usuario);
      setUserAuth(usuario);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'AppStack'}],
        }),
      );
    }
  }

  async function logar() {
    const credencial = await recuperaCredencialdaCache();
    console.log('Credencial recuperada:', credencial);

    if (credencial && credencial !== 'null') {
      try {
        const mensagem = await SignIn(credencial);
        console.log('Resultado do SignIn:', mensagem);

        if (mensagem === 'ok') {
          console.log('Login bem-sucedido');
          await buscaUsuario();
        } else {
          console.log('SignIn falhou, redirecionando para SignIn');
          irParaSignIn();
        }
      } catch (error) {
        console.error('Erro no SignIn:', error);
        irParaSignIn();
      }
    } else {
      console.log('Credencial inválida ou inexistente, redirecionando para SignIn');
      irParaSignIn();
    }
  }

  function irParaSignIn() {
    setDialogVisivel(false);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'SignIn'}],
      }),
    );
  }

  return (
    <View style={styles.container}>
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
