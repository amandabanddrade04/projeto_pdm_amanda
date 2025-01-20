import {yupResolver} from '@hookform/resolvers/yup';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ScrollView, StyleSheet} from 'react-native';
import {Button, Dialog, Text, TextInput, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as yup from 'yup';
import {Dependente} from '../model/Dependente';
import {Perfil} from '../model/Perfil';
import firestore from '@react-native-firebase/firestore'; // Importação do Firestore

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

export default function DependenteForm({navigation}: any) {
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    register,
    formState: {errors},
  } = useForm<any>({
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
      urlFoto: '',
      Perfil: Perfil.Dependente,
    },
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const [exibirSenha, setExibirSenha] = useState(true);
  const [requisitando, setRequisitando] = useState(false);
  const [dialogVisivel, setDialogVisivel] = useState(false);
  const [mensagem, setMensagem] = useState({tipo: '', mensagem: ''});
  const [checked] = React.useState<Perfil>(Perfil.Responsavel);

  useEffect(() => {
    register('nome');
    register('email');
    register('senha');
    register('urlFoto');
    register('perfil');
  }, [register]);

  // Função para salvar dependente no Firestore
  async function salvarDependenteNoFirestore(data: Dependente): Promise<string> {
    try {
      await firestore()
        .collection('dependentes') // Nome da coleção no Firestore
        .add({
          nome: data.nome,
          email: data.email,
          senha: data.senha,
          urlFoto: data.urlFoto,
          perfil: data.perfil,
        });
      return 'ok'; // Retorna 'ok' em caso de sucesso
    } catch (error) {
      console.error(error);
      return 'Erro ao salvar dependente no Firestore'; // Mensagem de erro
    }
  }

  async function onSubmit(data: Dependente) {
    setRequisitando(true);
    data.perfil = checked;

    const msg: string = await salvarDependenteNoFirestore(data);

    if (msg === 'ok') {
      setMensagem({
        tipo: 'ok',
        mensagem:
          'Show! Você foi cadastrado com sucesso. Verifique seu email para validar sua conta.',
      });
    } else {
      setMensagem({tipo: 'erro', mensagem: msg});
    }

    setDialogVisivel(true);
    setRequisitando(false);
  }

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
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.textinput}
              label="Senha"
              placeholder="Digite sua senha"
              mode="outlined"
              autoCapitalize="none"
              returnKeyType="next"
              secureTextEntry={exibirSenha}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              right={<TextInput.Icon icon="eye" onPress={() => setExibirSenha(prev => !prev)} />}
            />
          )}
          name="senha"
        />
        {errors.senha && (
          <Text style={{...styles.textError, color: theme.colors.error}}>
            {errors.senha?.message?.toString()}
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
