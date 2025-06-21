import React, {useContext, useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {List, TextInput, Button, Text, useTheme, Dialog} from 'react-native-paper'; 
import {CategoriaContext} from '../context/CategoriaProvider';

export default function GerenciarCategorias() {
  const {categorias, addCategoria} = useContext(CategoriaContext);
  const [nomeCategoria, setNomeCategoria] = useState('');
  const [loading, setLoading] = useState(false);
  const [dialogVisivel, setDialogVisivel] = useState(false);
  const [dialogMensagem, setDialogMensagem] = useState('');
  const theme = useTheme();

  const handleAddCategoria = async () => {
    if (nomeCategoria.trim().length === 0) {
      setDialogMensagem('Por favor, digite um nome para a categoria.');
      setDialogVisivel(true);
      return;
    }
    setLoading(true);
    const result = await addCategoria(nomeCategoria);
    if (result === 'ok') {
      setDialogMensagem('Categoria adicionada com sucesso!');
      setNomeCategoria('');
    } else {
      setDialogMensagem('Erro ao adicionar categoria.');
    }
    setDialogVisivel(true);
    setLoading(false);
  };

  return (
    <>
      <View style={{...styles.container, backgroundColor: theme.colors.background}}>
        <Text variant="headlineSmall" style={styles.title}>
          Gerenciar Categorias
        </Text>
        <View style={styles.formContainer}>
          <TextInput
            label="Nome da Nova Categoria"
            value={nomeCategoria}
            onChangeText={setNomeCategoria}
            style={styles.input}
            mode="outlined"
          />
          <Button
            mode="contained"
            onPress={handleAddCategoria}
            loading={loading}
            disabled={loading}>
            Adicionar
          </Button>
        </View>
        <FlatList
          data={categorias}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <List.Item title={item.nome} left={() => <List.Icon icon="folder-outline" />} />
          )}
        />
      </View>

      <Dialog visible={dialogVisivel} onDismiss={() => setDialogVisivel(false)}>
        <Dialog.Title>Aviso</Dialog.Title>
        <Dialog.Content>
          <Text>{dialogMensagem}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setDialogVisivel(false)}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    </>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  title: {textAlign: 'center', marginBottom: 20},
  formContainer: {marginBottom: 20},
  input: {marginBottom: 10},
});
