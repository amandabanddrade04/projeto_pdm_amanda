import React, {useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Text, Button, Card, Checkbox} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function DelegarTarefaTela({navigation}: any) {
  const [dependentes, setDependentes] = useState<any[]>([]);
  const [tarefas, setTarefas] = useState<any[]>([]);
  const [dependenteSelecionado, setDependenteSelecionado] = useState<string | null>(null);
  const [tarefasSelecionadas, setTarefasSelecionadas] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarDependentes();
    carregarTarefas();
  }, []);

  const carregarDependentes = async () => {
    const responsavelId = auth().currentUser?.uid;
    if (!responsavelId) return;

    const snapshot = await firestore()
      .collection('dependentes')
      .where('responsavelId', '==', responsavelId)
      .get();

    const lista = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    setDependentes(lista);
  };

  const carregarTarefas = async () => {
    const snapshot = await firestore().collection('tarefas').get();
    const lista = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    setTarefas(lista);
  };

  const alternarSelecaoTarefa = (id: string) => {
    setTarefasSelecionadas(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  };

  const delegarTarefas = async () => {
    if (!dependenteSelecionado || tarefasSelecionadas.length === 0) return;
    setCarregando(true);
    try {
      const dataAtual = new Date().toISOString();
      for (const tarefaId of tarefasSelecionadas) {
        const tarefa = tarefas.find(t => t.id === tarefaId);
        await firestore().collection('tarefas_atribuidas').add({
          dependenteId: dependenteSelecionado,
          tarefaId,
          categoriaId: tarefa.categoriaId,
          dataAtribuicao: dataAtual,
          status: 'pendente',
        });
      }
      alert('Tarefas atribuídas com sucesso!');
      navigation.goBack();
    } catch (e) {
      console.error(e);
      alert('Erro ao atribuir tarefas.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge">Selecione um dependente:</Text>
      {dependentes.map(dep => (
        <Card key={dep.id} style={styles.card} onPress={() => setDependenteSelecionado(dep.id)}>
          <Card.Title title={dep.nome} />
          {dependenteSelecionado === dep.id && <Text style={styles.selecionado}>Selecionado</Text>}
        </Card>
      ))}

      <Text variant="titleLarge" style={{marginTop: 20}}>
        Selecione tarefas:
      </Text>
      {tarefas.map(tarefa => (
        <Card key={tarefa.id} style={styles.card}>
          <Card.Title title={tarefa.nome} subtitle={tarefa.descricao} />
          <Checkbox
            status={tarefasSelecionadas.includes(tarefa.id) ? 'checked' : 'unchecked'}
            onPress={() => alternarSelecaoTarefa(tarefa.id)}
          />
        </Card>
      ))}

      <Button
        mode="contained"
        disabled={!dependenteSelecionado || tarefasSelecionadas.length === 0 || carregando}
        loading={carregando}
        onPress={delegarTarefas}
        style={{marginTop: 20}}>
        Delegar Tarefas
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  card: {
    marginVertical: 10,
    padding: 10,
  },
  selecionado: {
    color: 'red',
    marginLeft: 15,
  },
});
