import React, {useContext} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Avatar, Card, FAB, List, useTheme} from 'react-native-paper';
import {Dependente} from '../model/Dependente';
import {DependenteContext} from '../context/DependenteProvider';

export default function Dependentes({navigation}: any) {
  const theme = useTheme();
  const {dependentes, setDependente} = useContext<any>(DependenteContext);

  const irParaTelaDependente = (dependente: Dependente | null) => {
    setDependente(dependente);
    navigation.navigate('DependenteStack');
  };

  return (
    <View style={{...styles.container, backgroundColor: theme.colors.background}}>
      <List.Section style={{...styles.list, backgroundColor: theme.colors.background}}>
        <List.Subheader style={styles.subhearder}>Meus Dependentes</List.Subheader>
        <ScrollView>
          <>
            {dependentes.map((dependente: Dependente, key: number) => (
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
          </>
        </ScrollView>
      </List.Section>
      <FAB icon="plus" style={styles.fab} onPress={() => irParaTelaDependente(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  subhearder: {
    fontSize: 20,
    alignSelf: 'center',
  },
  list: {
    width: '95%',
  },
  card: {
    height: 100,
    width: '100%',
    borderWidth: 1,
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
