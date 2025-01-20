import {yupResolver} from '@hookform/resolvers/yup';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ScrollView, StyleSheet} from 'react-native';
import {Button, Dialog, Text, TextInput, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as yup from 'yup';
import {Dependente} from '../model/Dependente';

const requiredMessage = 'Campo obrigatório';

const schema = yup
  .object()
  .shape({
    nome: yup.string().required(requiredMessage).min(3, 'O nome deve ter ao menos 3 caracteres'),
    email: yup
      .string()
      .required(requiredMessage)
      .matches(/\S+@\S+\.\S+/, 'Email inválido'),
  })
  .required();

export default function DependenteForm({route, navigation}: any) {
  const theme = useTheme();
  const {dependente} = route.params;
  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm<any>({
    defaultValues: {
      nome: dependente?.nome || '',
      email: dependente?.email || '',
    },
    resolver: yupResolver(schema),
  });
  const [requisitando, setRequisitando] = useState(false);
  const [dialogVisivel, setDialogVisivel] = useState(false);
  const [mensagem, setMensagem] = useState({tipo: '', mensagem: ''});

  useEffect(() => {
    if (dependente) {
      setValue('nome', dependente.nome);
      setValue('email', dependente.email);
    }
  }, [dependente, setValue]);

  const onSubmit = async (data: Dependente) => {
    setRequisitando(true);
    try {
      if (dependente) {
        // Atualização de dependente
        console.log('Atualizar dependente:', data);
      } else {
        // Cadastro de novo dependente
        console.log('Cadastrar dependente:', data);
      }
      setMensagem({tipo: 'ok', mensagem: 'Dependente salvo com sucesso!'});
    } catch (error) {
      setMensagem({tipo: 'erro', mensagem: 'Erro ao salvar dependente!'});
    } finally {
      setDialogVisivel(true);
      setRequisitando(false);
    }
  };

  return (
    <SafeAreaView style={{...styles.container, backgroundColor: theme.colors.background}}>
      <ScrollView>
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.textinput}
              label="Nome"
              placeholder="Digite o nome do dependente"
              mode="outlined"
              autoCapitalize="words"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              right={<TextInput.Icon icon="account" />}
            />
          )}
          name="nome"
        />
        {errors.nome && (
          <Text style={{...styles.textError, color: theme.colors.error}}>
            {errors.nome?.message?.toString()}
          </Text>
        )}

        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.textinput}
              label="Email"
              placeholder="Digite o email do dependente"
              mode="outlined"
              autoCapitalize="none"
              keyboardType="email-address"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              right={<TextInput.Icon icon="email" />}
            />
          )}
          name="email"
        />
        {errors.email && (
          <Text style={{...styles.textError, color: theme.colors.error}}>
            {errors.email?.message?.toString()}
          </Text>
        )}

        <Button
          style={styles.button}
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={requisitando}
          disabled={requisitando}>
          {!requisitando ? 'Salvar' : 'Salvando'}
        </Button>
      </ScrollView>

      <Dialog
        visible={dialogVisivel}
        onDismiss={() => {
          setDialogVisivel(false);
          if (mensagem.tipo === 'ok') {
            navigation.goBack();
          }
        }}>
        <Dialog.Icon
          icon={mensagem.tipo === 'ok' ? 'checkbox-marked-circle-outline' : 'alert-circle-outline'}
          size={60}
        />
        <Dialog.Title style={styles.textDialog}>
          {mensagem.tipo === 'ok' ? 'Sucesso' : 'Erro'}
        </Dialog.Title>
        <Dialog.Content>
          <Text style={styles.textDialog} variant="bodyLarge">
            {mensagem.mensagem}
          </Text>
        </Dialog.Content>
      </Dialog>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  textinput: {
    width: 350,
    marginTop: 20,
    backgroundColor: 'transparent',
  },
  textError: {
    width: 350,
    textAlign: 'left',
  },
  button: {
    marginTop: 50,
    marginBottom: 30,
  },
  textDialog: {
    textAlign: 'center',
  },
});
