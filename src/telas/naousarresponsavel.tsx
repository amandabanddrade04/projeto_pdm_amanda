import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Image, StyleSheet, View} from 'react-native';
import {Text, TextInput, useTheme} from 'react-native-paper';
import {Responsavel} from '../model/Responsavel';

export default function ResponsavelTela({route}: any) {
  const [responsavel, setResponsavel] = useState<Responsavel | null>(null);
  const theme = useTheme();
  const {control, handleSubmit} = useForm<any>({
    defaultValues: {
      nome: responsavel?.nome,
      email: responsavel?.email,
    },
  });

  return (
    <View style={{...styles.container, backgroundColor: theme.colors.background}}>
      <Text variant="headlineSmall">Responsável</Text>
      <Image
        style={styles.image}
        source={
          responsavel && responsavel?.urlFoto !== ''
            ? {uri: responsavel?.urlFoto}
            : require('../assets/images/person.png')
        }
        loadingIndicatorSource={require('../assets/images/person.png')}
      />

      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.textinput}
            label="Nome"
            placeholder="Digite seu nome completo"
            mode="outlined"
            autoCapitalize="words"
            returnKeyType="next"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            editable={false}
            right={<TextInput.Icon icon="smart-card" />}
          />
        )}
        name="nome"
      />
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.textinput}
            label="Email"
            placeholder="Digite seu email"
            mode="outlined"
            autoCapitalize="none"
            returnKeyType="next"
            keyboardType="email-address"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            right={<TextInput.Icon icon="email" />}
          />
        )}
        name="email"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    borderRadius: 180 / 2,
    marginTop: 50,
  },
  textinput: {
    width: 350,
    height: 50,
    marginTop: 20,
    backgroundColor: 'transparent',
  },
});
