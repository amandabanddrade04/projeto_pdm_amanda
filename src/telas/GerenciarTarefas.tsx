import React, {useContext, useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {List, TextInput, Button, Text, useTheme, Dialog} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import {TarefaContext} from '../context/TarefaProvider';
import {CategoriaContext} from '../context/CategoriaProvider';
import {Tarefa} from '../model/Tarefa';

export default function GerenciarTarefas() {
  const {tarefas, salvar} = useContext(TarefaContext);
  const {categorias} = useContext(CategoriaContext);

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [loading, setLoading] = useState(false);
  const [dialogVisivel, setDialogVisivel] = useState(false);
  const [dialogMensagem, setDialogMensagem] = useState('');
  const theme = useTheme();

  const handleAddTask = async () => {
    if (!nome.trim() || !descricao.trim() || !categoriaId) {
      setDialogMensagem('Por favor, preencha todos os campos.');
      setDialogVisivel(true);
      return;
    }
    setLoading(true);
    const novaTarefa: Tarefa = {
      nome,
      descricao,
      categoriaId,
      id: '',
      uid: new Date().getTime().toString(),
    };
    const result = await salvar(novaTarefa);
    if (result === 'ok') {
      setDialogMensagem('Tarefa adicionada com sucesso!');
      setNome('');
      setDescricao('');
      setCategoriaId('');
    } else {
      setDialogMensagem('Erro ao adicionar tarefa.');
    }
    setDialogVisivel(true);
    setLoading(false);
  };

  return (
    <View style={{...styles.container, backgroundColor: theme.colors.background}}>
      <Text variant="headlineSmall" style={styles.title}>
        Gerenciar Tarefas
      </Text>
      <TextInput
        label="Nome da Tarefa"
        value={nome}
        onChangeText={t => setNome(t)}
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
      <Picker selectedValue={categoriaId} onValueChange={itemValue => setCategoriaId(itemValue)}>
        <Picker.Item label="Selecione uma categoria..." value="" />
        {categorias.map(cat => (
          <Picker.Item key={cat.id} label={cat.nome} value={cat.id} />
        ))}
      </Picker>
      <Button mode="contained" onPress={handleAddTask} loading={loading} disabled={loading}>
        Adicionar Tarefa
      </Button>

      <Text variant="titleMedium">Tarefas Existentes:</Text>
      <FlatList
        data={tarefas}
        keyExtractor={item => item.uid}
        renderItem={({item}) => <List.Item title={item.nome} description={item.descricao} />}
        contentContainerStyle={styles.listContent}
      />
      <Dialog visible={dialogVisivel} onDismiss={() => setDialogVisivel(false)}>
        <Dialog.Title>Aviso</Dialog.Title>
        <Dialog.Content>
          <Text>{dialogMensagem}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setDialogVisivel(false)}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  listContent: {3
    padding: 20,
  },
  title: {textAlign: 'center', marginBottom: 20},
  formContainer: {marginBottom: 30},
  input: {marginBottom: 10},
  pickerContainer: {borderWidth: 1, borderColor: 'grey', borderRadius: 4, marginBottom: 10},
});
