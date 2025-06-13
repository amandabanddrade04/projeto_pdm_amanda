import React, {createContext, useEffect, useState, useContext} from 'react';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {Dependente} from '../model/Dependente';
import {AuthContext} from './AuthProvider';
import {UserContext} from './UserProvider';
import {Perfil} from '../model/Perfil';

export const DependenteContext = createContext<any>({});

export const DependenteProvider = ({children}: any) => {
  const [dependentes, setDependentes] = useState<Dependente[]>([]);
  const [dependente, setDependente] = useState<Dependente | null>(null);

  const {userAuth} = useContext(AuthContext);
  const {getUser} = useContext(UserContext);

  useEffect(() => {
    if (!userAuth) {
      setDependentes([]);
      return;
    }

    let unsubscribe: () => void;

    const setupListener = async () => {
      const usuarioLogado = await getUser();

      if (!usuarioLogado || !usuarioLogado.perfil) {
        return;
      }

      const query = firestore().collection('dependentes');

      if (usuarioLogado.perfil === Perfil.Responsavel) {
        unsubscribe = query.where('responsavelId', '==', userAuth.uid).onSnapshot(snapShot => {
          if (snapShot) {
            let data: Dependente[] = [];
            snapShot.forEach(doc => {
              data.push({
                uid: doc.id,
                nome: doc.data().nome,
                email: doc.data().email,
                urlFoto: doc.data().urlFoto,
                responsavelId: doc.data().responsavelId,
              });
            });
            setDependentes(data);
          }
        });
      } else if (usuarioLogado.perfil === Perfil.Dependente) {
        unsubscribe = query.doc(userAuth.uid).onSnapshot(doc => {
          if (doc.exists) {
            const docData = doc.data();
            const data: Dependente = {
              uid: doc.id,
              nome: docData?.nome,
              email: docData?.email,
              urlFoto: docData?.urlFoto,
              responsavelId: docData?.responsavelId,
            };
            setDependentes([data]);
          } else {
            setDependentes([]);
          }
        });
      }
    };

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userAuth, getUser]);

  const salvar = async (dependente: Dependente, urlDevice: string): Promise<string> => {
    try {
      console.log('DependenteProvider, salvar: ');
      console.log(dependente);
      if (dependente.uid === '') {
        dependente.uid = firestore().collection('dependentes').doc().id;
      }
      if (urlDevice !== '') {
        dependente.urlFoto = await sendImageToStorage(dependente, urlDevice);
        if (!dependente.urlFoto) {
          return 'Não foi possíve salvar a imagem. Contate o suporte técnico.';
        }
      }
      await firestore().collection('dependentes').doc(dependente.uid).set(
        {
          nome: dependente.nome,
          email: dependente.email,
          urlFoto: dependente.urlFoto,
        },
        {merge: true},
      );
      return 'ok';
    } catch (e) {
      console.error('DependenteProvider, salvar: ' + e);
      return 'Não foi possíve salvar o dependente. Por favor, contate o suporte técnico.';
    }
  };

  const excluir = async (dependente: Dependente) => {
    try {
      await firestore().collection('dependentes').doc(dependente.uid).delete();
      const pathToStorage = `imagens/usuarios/${dependente.uid}/foto.png`;
      await storage().ref(pathToStorage).delete();

      return 'ok';
    } catch (e) {
      console.error('DependenteProvider, excluir: ', e);
      return 'Não foi possíve excluir o Tarefa. Por favor, contate o suporte técnico.';
    }
  };

  async function sendImageToStorage(dependente: Dependente, urlDevice: string): Promise<string> {
    let imageRedimencionada = await ImageResizer.createResizedImage(urlDevice, 150, 200, 'PNG', 80);

    const pathToStorage = `imagens/usuarios/${dependente.uid}/foto.png`;

    let url: string | null = '';
    const task = storage().ref(pathToStorage).putFile(imageRedimencionada?.uri);
    task.on('state_changed', _taskSnapshot => {});

    await task.then(async () => {
      url = await storage().ref(pathToStorage).getDownloadURL();
      console.log(
        'Transf:\n' +
          '${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}',
      );
    });
    task.catch(e => {
      console.error('DependenteProvider, sendImageToStorage: ' + e);
      url = null;
    });
    return url;
  }

  return (
    <DependenteContext.Provider value={{dependentes, salvar, excluir, setDependente, dependente}}>
      {children}
    </DependenteContext.Provider>
  );
};
