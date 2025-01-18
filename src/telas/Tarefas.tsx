import React, {useContext} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Card, FAB, List, useTheme} from 'react-native-paper';
import {TarefaContext} from '../context/TarefaProvider';
import {Tarefa} from '../model/Tarefa';

export default function Tarefas({navigation}: any) {
  const theme = useTheme();
  const {tarefas} = useContext<any>(TarefaContext);

  const irParaTelaTarefa = (tarefa: Tarefa | null) => {
    navigation.navigate('TarefaTela', {
      tarefa,
    });
  };

  return (
    <View style={{...styles.container, backgroundColor: theme.colors.background}}>
      <List.Section style={{...styles.list, backgroundColor: theme.colors.background}}>
        <List.Subheader style={styles.subhearder}>Lista de Tarefas</List.Subheader>
        <ScrollView>
          {tarefas.map((tarefa: Tarefa, key: number) => (
            <Card
              key={key}
              style={{...styles.card, borderColor: theme.colors.secondary}}
              onPress={() => irParaTelaTarefa(tarefa)}>
              <Card.Title title={tarefa.nome} subtitle={tarefa.descricao} />
            </Card>
          ))}
        </ScrollView>
      </List.Section>
      <FAB icon="plus" style={styles.fab} onPress={() => irParaTelaTarefa(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  subhearder: {
    fontSize: 20,
    alignSelf: 'center',
  },
  list: {
    width: '95%',
  },
  card: {
    height: 100,
    width: '100%',
    borderWidth: 1,
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
