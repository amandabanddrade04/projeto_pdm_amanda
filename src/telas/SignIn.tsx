import React, {useContext, useEffect, useState} from 'react';
import {Image, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {Button, Dialog, Divider, Text, TextInput, useTheme} from 'react-native-paper';
import {AuthContext} from '../context/AuthProvider';
import {Credencial} from '../model/types';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {CommonActions} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const requiredMessage = 'Campo obrigatório';

/*
  /^
  (?=.*\d)              // deve conter ao menos um dígito
  (?=.*[a-z])           // deve conter ao menos uma letra minúscula
  (?=.*[A-Z])           // deve conter ao menos uma letra maiúscula
  (?=.*[$*&@#])         // deve conter ao menos um caractere especial
  [0-9a-zA-Z$*&@#]{8,}  // deve conter ao menos 8 dos caracteres mencionados
$/
*/
const schema = yup
  .object()
  .shape({
    email: yup
      .string()
      .required(requiredMessage)
      .matches(/\S+@\S+\.\S+/, 'Email inválido'),
    senha: yup
      .string()
      .required(requiredMessage)
      .matches(
        /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/,
        'A senha deve conter ao menos uma letra maiúscula, uma letra minúscula, um númeral, um caractere especial e um total de 8 caracteres',
      ),
  })
  .required();

function SignIn({navigation}: any) {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    register,
    formState: {errors},
  } = useForm<any>({
    defaultValues: {
      email: '',
      senha: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const [exibirSenha, setExibirSenha] = useState(true);
  const [logando, setLogando] = useState(false);
  const [dialogVisivel, setDialogVisivel] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const {signIn} = useContext<any>(AuthContext);

  useEffect(() => {
    if (dialogVisivel) {
      setLogando(false);
    }
  }, [dialogVisivel]);

  useEffect(() => {
    register('email');
    register('senha');
  }, [register]);

  async function onSubmit(data: Credencial) {
    setLogando(true);
    const mensagem = await signIn(data);
    if (mensagem === 'ok') {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Preload'}],
        }),
      );
    } else {
      setMensagemErro(mensagem);
      setDialogVisivel(true);
    }
  }

  return (
    <LinearGradient
      colors={['#72CFFF', '#FF9B9D']} // As cores do seu gradiente
      style={styles.gradientContainer}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image style={styles.image} source={require('../assets/images/LOGO.png')} />
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.textinput}
                autoCapitalize="none"
                mode="outlined"
                label="Email"
                placeholder="Digite seu email"
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
            rules={{
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.textinput}
                autoCapitalize="none"
                returnKeyLabel="go"
                mode="outlined"
                label="Senha"
                placeholder="Digite sua senha"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={exibirSenha}
                right={
                  <TextInput.Icon
                    icon="eye"
                    color={exibirSenha ? theme.colors.onBackground : theme.colors.error}
                    onPress={() => setExibirSenha(previus => !previus)}
                  />
                }
              />
            )}
            name="senha"
          />

          {errors.senha && (
            <Text style={{...styles.textError, color: theme.colors.error}}>
              {errors.senha?.message?.toString()}
            </Text>
          )}

          <Text
            style={{...styles.textEsqueceuSenha, color: theme.colors.tertiary}}
            variant="labelMedium"
            onPress={() => navigation.navigate('EsqueceuSenha')}>
            Esqueceu sua senha?
          </Text>
          <Button
            style={styles.button}
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={logando}
            disabled={logando}
            labelStyle={{fontWeight: 'bold'}}
            contentStyle={{paddingVertical: 4, paddingHorizontal: 40}}
            buttonColor="#F2EF7B">
            {!logando ? 'Entrar' : 'Entrando'}
          </Button>

          <Divider />
          <View style={styles.divCadastro}>
            <Text variant="labelMedium">Não tem uma conta?</Text>
            <Text
              style={{...styles.textCadastro, color: theme.colors.tertiary}}
              variant="labelMedium"
              onPress={() => navigation.navigate('SignUp')}>
              {' '}
              Cadastre-se
            </Text>
          </View>
        </ScrollView>
        <Dialog visible={dialogVisivel} onDismiss={() => setDialogVisivel(false)}>
          <Dialog.Icon icon="alert-circle-outline" size={60} />
          <Dialog.Title style={styles.textDialog}>Erro</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.textDialog} variant="bodyLarge">
              {mensagemErro}
            </Text>
          </Dialog.Content>
        </Dialog>
      </SafeAreaView>
    </LinearGradient>
  );
}

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 200,
    alignSelf: 'center',
    marginTop: 50,
  },
  textinput: {
    width: 350,
    height: 50,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
  },
  textEsqueceuSenha: {
    alignSelf: 'flex-end',
  },
  textCadastro: {},
  button: {
    marginTop: 50,
    marginBottom: 30,
  },

  textError: {
    width: 350,
  },

  divCadastro: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  textDialog: {
    textAlign: 'center',
  },
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
