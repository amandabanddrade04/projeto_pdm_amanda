import React, {useContext, useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {Button, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {DependenteContext} from '../context/DependenteProvider';

export default function DependentesTarefas() {
  const {dependente} = useContext<any>(DependenteContext);
  const [tarefas, setTarefas] = useState<any[]>([]);
  const navigation = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    if (dependente?.uid) {
      const unsubscribe = firestore()
        .collection('tarefas_atribuidas')
        .where('dependenteId', '==', dependente.uid)
        .onSnapshot(snapshot => {
          const data = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
          setTarefas(data);
        });
      return unsubscribe;
    }
  }, [dependente]);

  return (
    <View style={{...styles.container, backgroundColor: theme.colors.background}}>
      <Text style={styles.title}>Tarefas atribuídas a {dependente?.nome}</Text>

      <Button
        mode="contained"
        style={styles.button}
        onPress={() =>
          navigation.navigate('SelecionarTarefaTela', {dependenteId: dependente?.uid})
        }>
        Adicionar Tarefa
      </Button>

      {tarefas.length > 0 ? (
        <FlatList
          data={tarefas}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.tarefaCard}>
              <Text style={styles.tarefaTitulo}>{item.descricao}</Text>
              <Text style={styles.tarefaCategoria}>Categoria: {item.categoriaId || 'N/A'}</Text>
              <Text style={styles.tarefaPontos}>Status: {item.status}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>Nenhuma tarefa atribuída até o momento.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  button: {
    marginBottom: 20,
    width: '100%',
  },
  tarefaCard: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  tarefaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tarefaCategoria: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  tarefaPontos: {
    fontSize: 14,
    color: '#00796B',
    marginTop: 2,
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#888',
    marginTop: 10,
  },
});
