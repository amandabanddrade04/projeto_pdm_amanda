import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Text, Button, Checkbox, List, Dialog} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';

type RootStackParamList = {
  SelecionarTarefa: {
    dependenteId: string;
  };
};
type Tarefa = {
  id: string;
  nome: string;
  descricao: string;
  categoriaId: string;
};

export default function SelecionarTarefaTela() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'SelecionarTarefa'>>();
  const dependenteId = route.params.dependenteId;

  const [tarefasPorCategoria, setTarefasPorCategoria] = useState<Record<string, Tarefa[]>>({});
  const [selecionadas, setSelecionadas] = useState<Tarefa[]>([]);

  const [salvando, setSalvando] = useState(false);
  const [dialogVisivel, setDialogVisivel] = useState(false);
  const [mensagem, setMensagem] = useState({tipo: '', texto: ''});

  useEffect(() => {
    const carregarTarefas = async () => {
      const categoriasSnap = await firestore().collection('categorias').get();
      const tarefasSnap = await firestore().collection('tarefas').get();
      const categorias: Record<string, string> = {};
      categoriasSnap.forEach(doc => {
        categorias[doc.id] = doc.data().nome;
      });
      const agrupadas: Record<string, Tarefa[]> = {};
      tarefasSnap.forEach(doc => {
        const dados = doc.data();
        const categoriaNome = categorias[dados.categoriaId] || 'Outros';
        if (!agrupadas[categoriaNome]) agrupadas[categoriaNome] = [];
        agrupadas[categoriaNome].push({
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

  const toggleSelecionada = (tarefa: Tarefa) => {
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
    if (selecionadas.length === 0) return;

    setSalvando(true);
    try {
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
      setMensagem({tipo: 'ok', texto: 'Tarefas atribuídas com sucesso!'});
    } catch (error) {
      console.error('Erro ao salvar tarefas: ', error);
      setMensagem({tipo: 'erro', texto: 'Não foi possível atribuir as tarefas. Tente novamente.'});
    } finally {
      setSalvando(false);
      setDialogVisivel(true);
    }
  };

  const fecharDialog = () => {
    setDialogVisivel(false);
    if (mensagem.tipo === 'ok') {
      navigation.goBack();
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <List.AccordionGroup>
          {Object.entries(tarefasPorCategoria).map(([categoriaNome, tarefas]) => (
            <List.Accordion
              key={categoriaNome}
              title={categoriaNome}
              id={categoriaNome}
              left={props => <List.Icon {...props} icon="folder" />}>
              {tarefas.map(tarefa => (
                <Checkbox.Item
                  key={tarefa.id}
                  label={tarefa.nome}
                  status={selecionadas.some(t => t.id === tarefa.id) ? 'checked' : 'unchecked'}
                  onPress={() => toggleSelecionada(tarefa)}
                  style={styles.checkboxItem}
                />
              ))}
            </List.Accordion>
          ))}
        </List.AccordionGroup>

        <Button
          mode="contained"
          onPress={salvarTarefas}
          style={styles.button}
          loading={salvando}
          disabled={salvando || selecionadas.length === 0}>
          Confirmar Tarefas Selecionadas
        </Button>
      </ScrollView>

      <Dialog visible={dialogVisivel} onDismiss={fecharDialog}>
        <Dialog.Title style={styles.dialogTitle}>
          {mensagem.tipo === 'ok' ? 'Sucesso!' : 'Ops!'}
        </Dialog.Title>
        <Dialog.Content>
          <Text>{mensagem.texto}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={fecharDialog}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  checkboxItem: {
    paddingLeft: 20,
  },
  button: {
    margin: 20,
  },
  dialogTitle: {
    textAlign: 'center',
  },
});
