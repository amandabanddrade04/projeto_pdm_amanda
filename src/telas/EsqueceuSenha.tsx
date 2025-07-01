import {yupResolver} from '@hookform/resolvers/yup';
import React, {useContext, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ScrollView, StyleSheet} from 'react-native';
import {Button, Text, TextInput, useTheme, Dialog} from 'react-native-paper';
import * as yup from 'yup';
import {AuthContext} from '../context/AuthProvider';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';

const requiredMessage = 'Campo obrigatório';

const schema = yup.object().shape({
  email: yup
    .string()
    .required(requiredMessage)
    .matches(/\S+@\S+\.\S+/, 'Email inválido'),
});

export default function EsqueceuSenha({navigation}: any) {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<any>({
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const [requisitando, setRequisitando] = useState(false);
  const {recuperarSenha} = useContext<any>(AuthContext);
  const [dialogVisivel, setDialogVisivel] = useState(false);
  const [mensagem, setMensagem] = useState({tipo: '', mensagem: ''});

  async function onSubmit(data: any) {
    setRequisitando(true);
    const msg = await recuperarSenha(data.email);
    if (msg === 'ok') {
      setRequisitando(false);
      setMensagem({
        tipo: 'ok',
        mensagem: 'Show! Um email foi enviado e pode estar na caixa de entrada ou caixa de spam.',
      });
      setDialogVisivel(true);
    } else {
      setRequisitando(false);
      setMensagem({tipo: 'erro', mensagem: msg});
      setDialogVisivel(true);
    }
  }

  return (
    <LinearGradient
      colors={['#72CFFF', '#FF9B9D']} // As cores do seu gradiente
      style={styles.gradientContainer}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text variant="headlineMedium">Recuperar Senha</Text>
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.textInput}
                label="Email"
                placeholder="Digite seu email cadastrado"
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
            disabled={requisitando}
            labelStyle={{fontWeight: 'bold'}}
            contentStyle={{paddingVertical: 4, paddingHorizontal: 40}}
            buttonColor="#F2EF7B">
            {!requisitando ? 'Enviar' : 'Enviando'}
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
          <Dialog.Icon icon="alert-circle-outline" size={60} />
          <Dialog.Title style={styles.textDialog}>
            {mensagem.tipo === 'ok' ? 'Informação' : 'Erro'}
          </Dialog.Title>
          <Dialog.Content>
            <Text style={styles.textDialog} variant="bodyLarge">
              {mensagem.mensagem}
            </Text>
          </Dialog.Content>
        </Dialog>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  textInput: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#FFFFFF',
  },

  textError: {
    width: 350,
  },

  button: {
    marginTop: 50,
    marginBottom: 30,
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    marginBottom: 40, // Espaço entre o título e o campo de email
    color: 'white',
    fontWeight: 'bold',
  },
});
