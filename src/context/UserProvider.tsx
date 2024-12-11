import {AuthContext} from './AuthProvider';
import {Usuario} from '../model/usuario';
import {Perfil} from '../model/Perfil';
// import ImageResizer from '@babel/tech/react-native-image-resizer';
import auth, { signOut } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {createContext, useContext} from 'react';

export const UserContext = createContext({});

export const UserProvider = ({children}: any) => {
  const {setUserAuth} = useContext<any>(AuthContext);

  async function update(usuario: Usuario): Promise<string> {
    try {
      // if (urlDevice !== '') {
      //     usuario.urlFoto = await sendImageToStorage(usuario.codusuario, urlDevice);
      //     if (!usuario.urlFoto) {
      //         return 'Erro ao enviar imagem para o Storage';
      //     }
      // }
      const usuarioFirestore = {
        nome: usuario.nome,
        email: usuario.email,
        urlFoto: usuario.urlFoto,
        Perfil: usuario.perfil,
      };
      await firestore()
        .collection('usuarios')
        .doc(auth().currentUser?.uid)
        .set(usuarioFirestore, {merge: true});
      const usuarioAtualizado = await getUser();
      setUserAuth(usuarioAtualizado);
      return 'ok';
    } catch (e) {
      console.log(e);
      return 'Erro ao atualizar o usuário';
    }
  }
  //     async function sendImageToStorage(
  //         usuario: Usuario,
  //         urlDevice: string,
  //     ): Promise<string> {
  //         let imageRedimencionada = await ImageResizer.createResizedImage(
  //             urlDevice,
  //             150,
  //             200,
  //             'PNG',
  //             80,
  //         );

  //         const pathToStorage = 'imagens/usuarios/${
  //         Auth().currentUser?.codusuario
  //         }/foto.png';

  //         let url: string | null = '';
  //         const task = storage().ref(pathToStorage).putFile(imageRedimencionada.uri);
  //         task.on('state_changed', taskSnapshot => {
  //             console.log(
  //                 `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
  //             );
  //         });

  //         await task.then(async () => {
  //             url = await storage().ref(pathToStorage).getDownloadURL();
  //         });

  //         task.catch(e => {
  //             console.error('UserProvider, sendImageToStorage', e);
  //         });
  //         return url;
  // }

  async function del(uid: string): Promise<string> {
    try {
      await firestore().collection('usuarios').doc(uid).delete();
      await auth().currentUser?.delete();
      await signOut();
      return 'ok';
    } catch (e) {
      console.error(e);
      return 'Erro ao excluir o usuário';
    }
  }

  async function getUser() {
    try {
      let doc = await firestore().collection('usuarios').doc(auth().currentUser?.uid).get();
      if (doc.exists) {
        const userData = doc.data();
        if (userData) {
          userData.codusuario = auth().currentUser?.uid;
          return userData;
        }
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  return <UserContext.Provider value={{update, del, getUser}}>{children}</UserContext.Provider>;
};
