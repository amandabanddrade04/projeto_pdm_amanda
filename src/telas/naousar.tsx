/* eslint-disable react/no-unstable-nested-components */
import React, {useContext} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Avatar, Card, List, useTheme} from 'react-native-paper';
import {Dependente} from '../model/Dependente';
import {UserContext} from '../context/UserProvider';

export default function Dependentes({navigation}: any) {
  const theme = useTheme();
  //fake de dados para implementar a view
  const {dependentes} = useContext<any>(UserContext);

  const irParaTelaDependente = (dependente: Dependente) => {
    navigation.navigate('DependenteTela', {
      dependente,
    });
  };

  return (
    <View style={{...styles.container, backgroundColor: theme.colors.background}}>
      <List.Section style={{...styles.list, backgroundColor: theme.colors.background}}>
        <List.Subheader style={styles.subhearder}>Lista de Dependentes</List.Subheader>
        <ScrollView>
          {dependentes.map((dependente: Dependente, key: number) => (
            <Card
              key={key}
              style={{...styles.card, borderColor: theme.colors.secondary}}
              onPress={() => irParaTelaDependente(dependente)}>
              <Card.Title
                title={dependente.nome}
                left={() => <Avatar.Image size={40} source={{uri: dependente.urlFoto}} />}
              />
            </Card>
          ))}
        </ScrollView>
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
