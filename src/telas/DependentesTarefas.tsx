import React, {useContext, useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {Button, Card, Checkbox, Icon, List, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../context/AuthProvider';
import {TarefaContext} from '../context/TarefaProvider';
import {Perfil} from '../model/Perfil';

export default function DependentesTarefas() {
  const {userAuth} = useContext<any>(AuthContext);
  const {atualizarStatusTarefa} = useContext<any>(TarefaContext);

  const [tarefas, setTarefas] = useState<any[]>([]);
  const navigation = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    console.log('Dependente selecionado:', userAuth?.dependente);
    if (userAuth?.uid) {
      console.log('Dependente selecionado:', userAuth.uid);
      const unsubscribe = firestore()
        .collection('tarefas_atribuidas')
        .where('dependenteId', '==', userAuth.uid)
        .onSnapshot(snapshot => {
          console.log('Tarefas atualizadas:', snapshot.docs.length);
          const data = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
          setTarefas(data);
        });
      return unsubscribe;
    }
  }, [userAuth]);

  // Função para ser chamada quando o checkbox for pressionado
  const handleToggleTarefa = (tarefaId: string, statusAtual: string) => {
    const novoStatus = statusAtual === 'concluida' ? 'pendente' : 'concluida';
    atualizarStatusTarefa(tarefaId, novoStatus);
  };

  const renderTarefaItem = ({item}: {item: any}) => {
    // Se o usuário for um DEPENDENTE
    if (userAuth?.perfil === Perfil.Dependente) {
      return (
        <Card style={styles.tarefaCard}>
          <Checkbox.Item
            label={item.nome} // Mostra o nome da tarefa
            status={item.status === 'concluida' ? 'checked' : 'unchecked'}
            onPress={() => handleToggleTarefa(item.id, item.status)}
            labelStyle={
              item.status === 'concluida' ? styles.tarefaConcluida : styles.tarefaPendente
            }
          />
          {/* Adicionando a descrição para o dependente */}
          <Text style={styles.descricaoTarefa}>{item.descricao}</Text>
        </Card>
      );
    }

    // Se o usuário for um RESPONSÁVEL
    if (userAuth?.perfil === Perfil.Responsavel) {
      return (
        <Card style={styles.tarefaCard}>
          <List.Item
            title={item.nome}
            description={`Status: ${item.status}`} // Mostra o status como descrição
            titleStyle={styles.tarefaPendente}
            // Adiciona um ícone para indicar o status visualmente
            left={() => (
              <Icon
                source={item.status === 'concluida' ? 'check-circle' : 'alert-circle-outline'}
                color={item.status === 'concluida' ? 'green' : theme.colors.primary}
                size={24}
              />
            )}
          />
        </Card>
      );
    }

    // Retorno padrão (não deve acontecer se o usuário estiver logado)
    return null;
  };

  return (
    <View style={{...styles.container, backgroundColor: theme.colors.background}}>
      <Text style={styles.title}>Tarefas de {userAuth?.nome}</Text>

      {tarefas.length > 0 ? (
        <FlatList
          data={tarefas}
          keyExtractor={item => item.id}
          renderItem={renderTarefaItem} // Usa a nova função de renderização
        />
      ) : (
        <Text style={styles.emptyText}>Nenhuma tarefa atribuída até o momento.</Text>
      )}

      {userAuth?.perfil === Perfil.Responsavel && (
        <Button
          mode="contained"
          style={styles.button}
          // ## ALTERAÇÃO AQUI ##
          onPress={() =>
            // Mude de 'SelecionarTarefaTela' para 'SelecionarTarefa'
            navigation.navigate('SelecionarTarefa', {dependenteId: userAuth?.uid})
          }>
          Adicionar Tarefa
        </Button>
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
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
  },
  tarefaCard: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  descricaoTarefa: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 12,
    color: 'grey',
  },
  tarefaPendente: {
    textDecorationLine: 'none',
  },
  tarefaConcluida: {
    textDecorationLine: 'line-through',
    color: 'grey',
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#888',
    marginTop: 20,
  },
});
