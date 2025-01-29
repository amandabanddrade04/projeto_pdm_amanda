import firestore from '@react-native-firebase/firestore';
import React, {createContext, useEffect, useState} from 'react';
import {Tarefa} from '../model/Tarefa';

export const TarefaContext = createContext({});

export const TarefaProvider = ({children}: any) => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);

  useEffect(() => {
    const listener = firestore()
      .collection('tarefas')
      .orderBy('nome')
      .onSnapshot(snapShot => {
        //console.log(snapShot);
        //console.log(snapShot._docs);
        if (snapShot) {
          let data: Tarefa[] = [];
          snapShot.forEach(doc => {
            data.push({
              uid: doc.id,
              nome: doc.data().nome,
              descricao: doc.data().descricao,
            });
          });
          setTarefas(data);
        }
      });

    return () => {
      listener();
    };
  }, []);

  const salvar = async (tarefa: Tarefa): Promise<string> => {
    try {
      await firestore().collection('tarefas').doc(tarefa.uid).set(
        {
          nome: tarefa.nome,
          descricao: tarefa.descricao,
        },
        {merge: true},
      );
      return 'ok';
    } catch (e) {
      console.error('TarefaProvider, salvar: ' + e);
      return 'Não foi possíve salvar a imagem. Por favor, contate o suporte técnico.';
    }
  };

  const excluir = async (tarefa: Tarefa) => {
    try {
      await firestore().collection('tarefas').doc(tarefa.uid).delete();
      return 'ok';
    } catch (e) {
      console.error('TarefaProvider, excluir: ', e);
      return 'Não foi possíve excluir o Tarefa. Por favor, contate o suporte técnico.';
    }
  };

  return (
    <TarefaContext.Provider value={{tarefas, salvar, excluir}}>{children}</TarefaContext.Provider>
  );
};
