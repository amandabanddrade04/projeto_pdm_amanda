import {View, Text} from 'react-native';
import React, {useContext} from 'react';
import {TarefaContext} from '../context/TarefaProvider';

export default function DependentesTarefas() {
  const {tarefas} = useContext<any>(TarefaContext);
  console.log(tarefas);

  return (
    <View>
      <Text>Dependentes Tarefas</Text>
    </View>
  );
}
