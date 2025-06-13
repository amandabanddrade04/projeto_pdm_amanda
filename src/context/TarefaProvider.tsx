import firestore from '@react-native-firebase/firestore';
import React, {createContext, useEffect, useState} from 'react';
import {Tarefa} from '../model/Tarefa';

export const TarefaContext = createContext<any>({});

export const TarefaProvider = ({children}: any) => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);

  useEffect(() => {
    const listener = firestore()
      .collection('tarefas')
      .orderBy('nome')
      .onSnapshot(snapShot => {
        if (snapShot) {
          let data: Tarefa[] = [];
          snapShot.forEach(doc => {
            data.push({
              id: doc.id,
              uid: doc.id,
              nome: doc.data().nome,
              descricao: doc.data().descricao,
              categoriaId: doc.data().categoriaId,
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

  // Função para atualizar o status de uma tarefa atribuída
  const atualizarStatusTarefa = async (
    tarefaAtribuidaId: string,
    novoStatus: 'pendente' | 'concluida',
  ) => {
    try {
      await firestore().collection('tarefas_atribuidas').doc(tarefaAtribuidaId).update({
        status: novoStatus,
      });
      return 'ok';
    } catch (e) {
      console.error('TarefaProvider, atualizarStatusTarefa: ', e);
      return 'Não foi possível atualizar o status da tarefa.';
    }
  };

  return (
    <TarefaContext.Provider value={{tarefas, salvar, excluir, atualizarStatusTarefa}}>
      {children}
    </TarefaContext.Provider>
  );
};
