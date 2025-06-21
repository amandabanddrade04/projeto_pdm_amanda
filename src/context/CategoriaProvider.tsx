import React, {createContext, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import { Categoria } from '../model/Categoria';

type CategoriaContextType = {
  categorias: Categoria[];
  addCategoria: (nomeCategoria: string) => Promise<'ok' | 'erro'>;
};

export const CategoriaContext = createContext<CategoriaContextType>({
  categorias: [],
  addCategoria: async () => 'erro', 
});

export const CategoriaProvider = ({children}: any) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('categorias')
      .orderBy('nome')
      .onSnapshot(querySnapshot => {
        const data: Categoria[] = [];
        querySnapshot.forEach(doc => {
          data.push({
            id: doc.id,
            nome: doc.data().nome,
          });
        });
        setCategorias(data);
      });

    return () => unsubscribe();
  }, []);

  const addCategoria = async (nomeCategoria: string): Promise<'ok' | 'erro'> => {
    try {
      await firestore().collection('categorias').add({
        nome: nomeCategoria,
      });
      return 'ok';
    } catch (error) {
      console.error("Erro ao adicionar categoria: ", error);
      return 'erro';
    }
  };

  return (
    <CategoriaContext.Provider value={{categorias, addCategoria}}>
      {children}
    </CategoriaContext.Provider>
  );
};