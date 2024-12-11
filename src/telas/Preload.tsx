import {CommonActions} from '@react-navigation/native';
import React, {useContext, useEffect} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Dialog, Text, useTheme} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../context/AuthProvider';
// import {UserContext} from '../context/UserProvider';
// import {Usuario} from '../model/Usuario';

export default function Preload({navigation}: any) {
  const theme = useTheme();
  const {setUserAuth, recuperaCredencialdaCache, SignIn} = useContext<any>(AuthContext);
  // const {getUser} = useContext<any>(UserContext);
  // const [dialogVisivel, setDialogVisivel] = useState(false);
  // const [mensagemErro] = useState('Você precisa verificar seu email para continuar');

  useEffect(() => {
    //liga o listener e fica escutando o estado da autenticação no serviço Auth do Firebase
    const unsubscribe = auth().onAuthStateChanged(async authUser => {
      console.log('Preload');
      console.log(authUser);
      if (authUser) {
        setUserAuth(authUser);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'AppStack'}],
          }),
        );
      } else {
        logar();
      
      }
    });

    //ao desmontar
    return () => {
      unsubscribe(); //avisa o serviço Auth do Firebase para desligar o listener
    };
  }, []);

  async function logar() {
    const credencial = await recuperaCredencialdaCache();
    console.log('logar');
    console.log(credencial);
     if (credencial !== 'null') {
      const mensagem = await SignIn(credencial);
     if (mensagem === 'ok') {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'AppStack'}],
        }),
      );
    } else {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'SignIn'}],
      }),
    );
  }

  // async function buscaUsuario() {
  //   const usuario = await getUser();
  //   if (usuario) {
  //     console.log(usuario);
  //     setUserAuth(usuario);
  //     navigation.dispatch(
  //       CommonActions.reset({
  //         index: 0,
  //         routes: [{name: 'AppStack'}],
  //       }),
  //     );
  //   }
  // }

  // function irParaSignIn() {
  //   setDialogVisivel(false);
  //   navigation.dispatch(
  //     CommonActions.reset({
  //       index: 0,
  //       routes: [{name: 'SignIn'}],
  //     }),
  //   );
  // }

  return (
    <View style={{styles.container}}>
      <Image
        style={styles.imagem}
        source={require('../assets/images/LOGO.png')}
        accessibilityLabel="logo do app"
      />
      {/* <Dialog visible={dialogVisivel} onDismiss={irParaSignIn}>
        <Dialog.Icon icon="alert-circle-outline" size={60} />
        <Dialog.Title style={styles.textDialog}>Erro</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.textDialog} variant="bodyLarge">
            {mensagemErro}
          </Text>
        </Dialog.Content>
      </Dialog> */}
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
