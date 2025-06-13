import React, {useContext, useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {List, TextInput, Button, Text, useTheme} from 'react-native-paper';
import {CategoriaContext} from '../context/CategoriaProvider';

export default function GerenciarCategorias() {
  const {categorias, addCategoria} = useContext(CategoriaContext);
  const [nomeCategoria, setNomeCategoria] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleAddCategoria = async () => {
    if (nomeCategoria.trim().length === 0) {
      alert('Por favor, digite um nome para a categoria.');
      return;
    }
    setLoading(true);
    const result = await addCategoria(nomeCategoria);
    if (result === 'ok') {
      alert('Categoria adicionada com sucesso!');
      setNomeCategoria('');
    } else {
      alert('Erro ao adicionar categoria.');
    }
    setLoading(false);
  };

  return (
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
        <Button mode="contained" onPress={handleAddCategoria} loading={loading} disabled={loading}>
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
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  title: {textAlign: 'center', marginBottom: 20},
  formContainer: {marginBottom: 20},
  input: {marginBottom: 10},
});
