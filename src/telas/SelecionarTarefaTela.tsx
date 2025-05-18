import React, {useEffect, useState} from 'react';
import {View, ScrollView} from 'react-native';
import {Text, Button, Checkbox} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {useNavigation, useRoute} from '@react-navigation/native';

export default function SelecionarTarefaTela() {
  const navigation = useNavigation();
  const route = useRoute();
  const dependenteId = route.params?.dependenteId;

  const [tarefasPorCategoria, setTarefasPorCategoria] = useState({});
  const [selecionadas, setSelecionadas] = useState([]);

  useEffect(() => {
    const carregarTarefas = async () => {
      const categoriasSnap = await firestore().collection('categorias').get();
      const tarefasSnap = await firestore().collection('tarefas').get();

      const categorias = {};
      categoriasSnap.forEach(doc => {
        categorias[doc.id] = doc.data().nome;
      });

      const agrupadas = {};
      tarefasSnap.forEach(doc => {
        const dados = doc.data();
        const categoria = categorias[dados.categoriaId] || 'Outros';

        if (!agrupadas[categoria]) agrupadas[categoria] = [];

        agrupadas[categoria].push({
          id: doc.id,
          nome: dados.nome,
          descricao: dados.descricao,
          categoriaId: dados.categoriaId,
        });
      });

      setTarefasPorCategoria(agrupadas);
    };

    carregarTarefas();
  }, []);

  const toggleSelecionada = tarefa => {
    setSelecionadas(prev => {
      const jaTem = prev.find(t => t.id === tarefa.id);
      if (jaTem) {
        return prev.filter(t => t.id !== tarefa.id);
      } else {
        return [...prev, tarefa];
      }
    });
  };

  const salvarTarefas = async () => {
    const batch = firestore().batch();

    selecionadas.forEach(tarefa => {
      const ref = firestore().collection('tarefas_atribuidas').doc();
      batch.set(ref, {
        dependenteId: dependenteId,
        tarefaId: tarefa.id,
        nome: tarefa.nome,
        descricao: tarefa.descricao,
        categoriaId: tarefa.categoriaId,
        status: 'pendente',
        dataCriacao: firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
    navigation.goBack();
  };

  return (
    <ScrollView style={{padding: 16}}>
      {Object.entries(tarefasPorCategoria).map(([categoriaNome, tarefas]) => (
        <View key={categoriaNome} style={{marginBottom: 24}}>
          <Text variant="titleMedium" style={{marginBottom: 8}}>
            {categoriaNome}
          </Text>
          {tarefas.map(tarefa => (
            <Checkbox.Item
              key={tarefa.id}
              label={tarefa.nome}
              status={selecionadas.some(t => t.id === tarefa.id) ? 'checked' : 'unchecked'}
              onPress={() => toggleSelecionada(tarefa)}
            />
          ))}
        </View>
      ))}

      <Button mode="contained" onPress={salvarTarefas}>
        Confirmar
      </Button>
    </ScrollView>
  );
}
