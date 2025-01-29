import firestore from '@react-native-firebase/firestore';
import React, {createContext, useEffect, useState} from 'react';
import {Dependente} from '../model/Dependente';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import storage from '@react-native-firebase/storage';

export const DependenteContext = createContext({});

export const DependenteProvider = ({children}: any) => {
  const [dependentes, setDependentes] = useState<Dependente[]>([]);

  useEffect(() => {
    const listener = firestore()
      .collection('dependentes')
      .orderBy('nome')
      .onSnapshot(snapShot => {
        //console.log(snapShot);
        //console.log(snapShot._docs);
        if (snapShot) {
          let data: Dependente[] = [];
          snapShot.forEach(doc => {
            data.push({
              uid: doc.id,
              nome: doc.data().nome,
              email: doc.data().email,
              urlFoto: doc.data().urlFoto,
              perfil: doc.data().perfil,
              responsavel: doc.data().responsavel,
            });
          });
          console.log(data);
          setDependentes(data);
        }
      });

    return () => {
      listener();
    };
  }, []);

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
    <DependenteContext.Provider value={{dependentes, salvar, excluir}}>
      {children}
    </DependenteContext.Provider>
  );
};
