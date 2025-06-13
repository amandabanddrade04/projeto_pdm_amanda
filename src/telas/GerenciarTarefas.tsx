// Em: src/telas/GerenciarTarefas.tsx

import React, {useContext, useState} from 'react';
import {View, FlatList, StyleSheet, ScrollView} from 'react-native';
import {List, TextInput, Button, Text, useTheme} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import {TarefaContext} from '../context/TarefaProvider';
import {CategoriaContext} from '../context/CategoriaProvider';

export default function GerenciarTarefas() {
  const {tarefas, salvar} = useContext(TarefaContext);
  const {categorias} = useContext(CategoriaContext);

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleAddTask = async () => {
    if (!nome.trim() || !descricao.trim() || !categoriaId) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    setLoading(true);
    // A função salvar do seu TarefaProvider precisa ser ajustada para aceitar um objeto assim
    // ou você cria uma função 'addTarefa' nova. Vamos usar a 'salvar' por enquanto.
    const novaTarefa = {nome, descricao, categoriaId, uid: new Date().getTime().toString()};
    const result = await salvar(novaTarefa);
    if (result === 'ok') {
      alert('Tarefa adicionada com sucesso!');
      setNome('');
      setDescricao('');
      setCategoriaId('');
    } else {
      alert('Erro ao adicionar tarefa.');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={{...styles.container, backgroundColor: theme.colors.background}}>
      <Text variant="headlineSmall" style={styles.title}>
        Gerenciar Tarefas
      </Text>
      <View style={styles.formContainer}>
        <TextInput
          label="Nome da Tarefa"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Descrição"
          value={descricao}
          onChangeText={setDescricao}
          style={styles.input}
          mode="outlined"
          multiline
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={categoriaId}
            onValueChange={itemValue => setCategoriaId(itemValue)}>
            <Picker.Item label="Selecione uma categoria..." value="" />
            {categorias.map(cat => (
              <Picker.Item key={cat.id} label={cat.nome} value={cat.id} />
            ))}
          </Picker>
        </View>
        <Button mode="contained" onPress={handleAddTask} loading={loading} disabled={loading}>
          Adicionar Tarefa
        </Button>
      </View>
      <Text variant="titleMedium">Tarefas Existentes:</Text>
      <FlatList
        data={tarefas}
        keyExtractor={item => item.uid}
        renderItem={({item}) => <List.Item title={item.nome} description={item.descricao} />}
        style={{height: 300}} // Apenas para visualização em ScrollView
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  title: {textAlign: 'center', marginBottom: 20},
  formContainer: {marginBottom: 30},
  input: {marginBottom: 10},
  pickerContainer: {borderWidth: 1, borderColor: 'grey', borderRadius: 4, marginBottom: 10},
});
