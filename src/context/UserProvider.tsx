import {AuthContext} from './AuthProvider';
import {Usuario} from '../model/usuario';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {createContext, useContext, useEffect, useState} from 'react';
import storage from '@react-native-firebase/storage';
import {Perfil} from '../model/Perfil';

export const UserContext = createContext({});

export const UserProvider = ({children}: any) => {
  const {setUserAuth} = useContext<any>(AuthContext);
  const [responsaveis, setResponsaveis] = useState<Usuario[]>([]);
  const [dependentes, setDependentes] = useState<Usuario[]>([]);

  useEffect(() => {
    const listenerResponsaveis = firestore()
      .collection('usuarios')
      .where('perfil', '==', Perfil.Responsavel)
      .orderBy('nome')
      .onSnapshot(snapShot => {
        if (snapShot) {
          let data: Usuario[] = [];
          snapShot.forEach(doc => {
            data.push({
              uid: doc.id,
              nome: doc.data().nome,
              urlFoto: doc.data().urlFoto,
              perfil: doc.data().perfil,
              email: doc.data().email,
              senha: doc.data().senha,
            });
          });
          setResponsaveis(data);
        }
      });

    const listenerDependentes = firestore()
      .collection('usuarios')
      .where('perfil', '==', Perfil.Dependente)
      .orderBy('nome')
      .onSnapshot(snapShot => {
        if (snapShot) {
          let data: Usuario[] = [];
          snapShot.forEach(doc => {
            data.push({
              uid: doc.id,
              email: doc.data().email,
              nome: doc.data().nome,
              urlFoto: doc.data().urlFoto,
              senha: doc.data().senha,
              perfil: doc.data().perfil,
            });
          });
          setDependentes(data);
        }
      });

    return () => {
      listenerResponsaveis();
      listenerDependentes();
    };
  }, []);

  async function update(usuario: Usuario, urlDevice: string): Promise<string> {
    try {
      console.log(urlDevice);
      if (urlDevice !== '') {
        usuario.urlFoto = await sendImageToStorage(usuario, urlDevice);
        if (!usuario.urlFoto) {
          return 'Erro ao enviar imagem para o Storage';
        }
      }
      const usuarioFirestore = {
        nome: usuario.nome,
        email: usuario.email,
        urlFoto: usuario.urlFoto,
        perfil: usuario.perfil,
      };
      await firestore()
        .collection('usuarios')
        .doc(auth().currentUser?.uid)
        .set(usuarioFirestore, {merge: true});
      const usuarioAtualizado = await getUser();
      setUserAuth(usuarioAtualizado);
      return 'ok';
    } catch (e) {
      return 'Erro ao atualizar o usuário';
    }
  }
  async function sendImageToStorage(usuario: Usuario, urlDevice: string): Promise<string> {
    let imageRedimencionada = await ImageResizer.createResizedImage(urlDevice, 150, 200, 'PNG', 80);

    const pathToStorage = `imagens/usuarios/${auth().currentUser?.uid}/foto.png`;

    let url: string | null = '';
    const task = storage().ref(pathToStorage).putFile(imageRedimencionada.uri);
    task.on('state_changed', taskSnapshot => {
      // eslint-disable-next-line no-console
      console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
    });

    await task.then(async () => {
      url = await storage().ref(pathToStorage).getDownloadURL();
    });

    task.catch(e => {
      console.error('UserProvider, sendImageToStorage', e);
      url = null;
    });
    return url;
  }

  async function del(uid: string): Promise<string> {
    try {
      await firestore().collection('usuarios').doc(uid).delete();
      await auth().currentUser?.delete();
      return 'ok';
    } catch (e) {
      console.error(e);
      return 'Erro ao excluir o usuário';
    }
  }

async function getUser() {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) return null;

      let doc = await firestore().collection('usuarios').doc(currentUser.uid).get();
      if (doc.exists) {
        const userData = doc.data();
        if (userData) {
          // ## A CORREÇÃO ESTÁ AQUI ##
          // Corrigido de 'codusuario' para 'uid' para manter a consistência
          userData.uid = currentUser.uid;
          return userData;
        }
      }
      return null;
    } catch (e) {
      console.error('Erro ao obter usuário:', e);
      return null;
    }
  }

  async function atribuirTarefaAoDependente(idDependente: string, tarefa: any): Promise<string> {
    try {
      await firestore()
        .collection('tarefas')
        .add({
          ...tarefa,
          id_dependente: idDependente,
          concluida: false,
          dataCriacao: firestore.FieldValue.serverTimestamp(),
        });
      return 'ok';
    } catch (e) {
      console.error('Erro ao atribuir tarefa:', e);
      return 'Erro ao atribuir tarefa ao dependente';
    }
  }

  return (
    <UserContext.Provider
      value={{update, del, getUser, responsaveis, dependentes, atribuirTarefaAoDependente}}>
      {children}
    </UserContext.Provider>
  );
};
