import React, {useContext} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Avatar, Card, FAB, useTheme} from 'react-native-paper';
import {Dependente} from '../model/Dependente';
import {DependenteContext} from '../context/DependenteProvider';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function Dependentes({navigation}: any) {
  const theme = useTheme();
  const {dependentes, setDependente} = useContext<any>(DependenteContext);

  const irParaTelaDependente = (dependenteSelecionado: Dependente | null) => {
    setDependente(dependenteSelecionado); // Continuamos atualizando o contexto para outros usos
    // Navegamos para a pilha do dependente e passamos os dados dele como parâmetro
    navigation.navigate('DependenteStack', {
      screen: 'TarefasDoDependente', // Especifica a tela inicial da pilha
      params: {dependenteClicado: dependenteSelecionado}, // Passa o objeto do dependente
    });
  };

  return (
    <LinearGradient
      colors={['#72CFFF', '#FF9B9D']} // As cores do seu gradiente
      style={styles.gradientContainer}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {dependentes &&
            dependentes.map((dependente: Dependente, key: number) => (
              <Card
                key={key}
                style={{...styles.card, borderColor: theme.colors.secondary}}
                onPress={() => irParaTelaDependente(dependente)}>
                <Card.Title
                  title={dependente.nome}
                  subtitle={dependente.email}
                  left={() => <Avatar.Image size={40} source={{uri: dependente.urlFoto}} />}
                />
              </Card>
            ))}
        </ScrollView>
        <FAB icon="plus" style={styles.fab} onPress={() => irParaTelaDependente(null)} />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    paddingBottom: 100, // <-- Adicione este espaçamento
  },
  title: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 24,
  },
  subhearder: {
    fontSize: 20,
    alignSelf: 'center',
  },
  list: {
    width: '95%',
  },
  card: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
  },
  fab: {
    position: 'absolute',
    right: 30, // Posição a partir da direita
    bottom: 90, // Posição a partir de baixo (altura da TabBar + margem)
  },
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
});
