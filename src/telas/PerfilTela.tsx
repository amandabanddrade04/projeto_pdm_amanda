import {yupResolver} from '@hookform/resolvers/yup';
import React, {useContext, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {Button, Dialog, Text, TextInput, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as yup from 'yup';
import {AuthContext} from '../context/AuthProvider';
import {UserContext} from '../context/UserProvider';
import {Usuario} from '../model/Usuario';
import {CommonActions} from '@react-navigation/native';
import {ImageLibraryOptions, launchCamera, launchImageLibrary} from 'react-native-image-picker';

const requiredMessage = 'Campo obrigatório';

const schema = yup
  .object()
  .shape({
    nome: yup.string().required(requiredMessage).min(2, 'O nome deve ter ao menos 2 caracteres'),
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
    confirmar_senha: yup
      .string()
      .required(requiredMessage)
      .equals([yup.ref('senha')], 'As senhas não conferem'),
  })
  .required();

export default function PerfilTela({navigation}: any) {
  const {userAuth} = useContext<any>(AuthContext);
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<any>({
    defaultValues: {
      nome: userAuth.nome,
      email: userAuth.email,
      perfil: userAuth.perfil,
    },
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });
  const [requisitando, setRequisitando] = useState(false);
  const [dialogErroVisivel, setDialogErroVisivel] = useState(false);
  const [dialogExcluirVisivel, setDialogExcluirVisivel] = useState(false);
  const [mensagem, setMensagem] = useState({tipo: '', mensagem: ''});
  const {update, del} = useContext<any>(UserContext);
  const [urlDevice, setUrlDevice] = useState<string | undefined>('');
  const [excluindo, setExcluindo] = useState(false);
  const [atualizando, setAtualizando] = useState(false);

  async function atualizaPerfil(data: Usuario) {
    setRequisitando(true);
    setAtualizando(true);
    data.urlFoto = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50';

    console.log(data);
    console.log(urlDevice);
    const msg = await update(data, urlDevice);
    if (msg === 'ok') {
      setMensagem({
        tipo: 'ok',
        mensagem:
          'Show! Seu perfil foi atualizado com sucesso. Verifique seu email para validar sua conta.',
      });
      setDialogErroVisivel(true);
      setRequisitando(false);
      setAtualizando(false);
    } else {
      setMensagem({tipo: 'erro', mensagem: msg});
      setDialogErroVisivel(true);
      setRequisitando(false);
      setAtualizando(false);
    }
  }

  function avisarDaExclusaoPermanente() {
    setDialogExcluirVisivel(true);
  }

  async function excluirConta() {
    setDialogExcluirVisivel(false);
    setRequisitando(true);
    setExcluindo(true);
    const msg = await del(userAuth.uid);
    if (msg === 'ok') {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'AuthStack'}],
        }),
      );
    } else {
      setMensagem({tipo: 'erro', mensagem: 'ops! algo deu errado'});
      setDialogErroVisivel(true);
      setRequisitando(false);
      setExcluindo(false);
    }
  }

  const buscaNaGaleria = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
    };
    launchImageLibrary(options, response => {
      if (response.errorCode) {
        setMensagem({tipo: 'erro', mensagem: 'Ops! Erro ao buscar a imagem.'});
      } else if (response.didCancel) {
        setMensagem({tipo: 'ok', mensagem: 'Ok, você cancelou.'});
      } else {
        const path = response.assets?.[0].uri;
        setUrlDevice(path);
      }
    });
  };

  function tiraFoto() {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
    };
    launchCamera(options, response => {
      if (response.errorCode) {
        setMensagem({tipo: 'ok', mensagem: 'Ops! Erro ao tirar foto'});
      } else if (response.didCancel) {
        setMensagem({tipo: 'ok', mensagem: 'Ok, você cancelou'});
      } else {
        const path = response.assets?.[0].uri;
        setUrlDevice(path);
      }
    });
  }

  return (
    <SafeAreaView style={{...styles.container, backgroundColor: theme.colors.background}}>
      <ScrollView>
        <>
          <Image
            style={styles.image}
            source={
              urlDevice !== ''
                ? {uri: urlDevice}
                : userAuth.urlFoto !== ''
                ? {uri: userAuth.urlFoto}
                : require('../assets/images/person.png')
            }
            loadingIndicatorSource={require('../assets/images/person.png')}
          />
          <View style={styles.divButtonsImage}>
            <Button
              style={styles.buttonImage}
              mode="outlined"
              icon="image"
              onPress={() => buscaNaGaleria()}>
              Galeria
            </Button>
            <Button
              style={styles.buttonImage}
              mode="outlined"
              icon="camera"
              onPress={() => tiraFoto()}>
              Foto
            </Button>
          </View>

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
                right={<TextInput.Icon icon="smart-card" />}
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
                disabled
                label="Perfil"
                placeholder="Clique para selecionar outro perfil"
                mode="outlined"
                autoCapitalize="none"
                returnKeyType="go"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                right={<TextInput.Icon icon="account-eye" />}
              />
            )}
            name="perfil"
          />
          {errors.perfil && (
            <Text style={{...styles.textError, color: theme.colors.error}}>
              {errors.perfil?.message?.toString()}
            </Text>
          )}

          <Button
            style={styles.button}
            mode="contained"
            onPress={handleSubmit(() => console.log('===================================='))}
            loading={requisitando}
            disabled={requisitando}>
            {!atualizando ? 'Atualizar' : 'Atualizando'}
          </Button>
          <Button
            style={styles.buttonOthers}
            mode="outlined"
            onPress={handleSubmit(avisarDaExclusaoPermanente)}
            loading={requisitando}
            disabled={requisitando}>
            {!excluindo ? 'Excluir' : 'Excluindo'}
          </Button>
        </>
      </ScrollView>
      <Dialog
        visible={dialogExcluirVisivel}
        onDismiss={() => {
          setDialogExcluirVisivel(false);
        }}>
        <Dialog.Icon icon={'alert-circle-outline'} size={60} />
        <Dialog.Title style={styles.textDialog}>{'Ops!'}</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.textDialog} variant="bodyLarge">
            {'Você tem certeza que deseja excluir sua conta?\nEsta operação será irreversível.'}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setDialogExcluirVisivel(false)}>Cancelar</Button>
          <Button onPress={excluirConta}>Excluir</Button>
        </Dialog.Actions>
      </Dialog>
      <Dialog
        visible={dialogErroVisivel}
        onDismiss={() => {
          setDialogErroVisivel(false);
          if (mensagem.tipo === 'ok') {
            navigation.goBack();
          }
        }}>
        <Dialog.Icon
          icon={mensagem.tipo === 'ok' ? 'checkbox-marked-circle-outline' : 'alert-circle-outline'}
          size={60}
        />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    borderRadius: 200 / 2,
    marginTop: 50,
  },
  textinput: {
    width: 350,
    height: 50,
    marginTop: 20,
    backgroundColor: 'transparent',
  },
  textEsqueceuSenha: {
    alignSelf: 'flex-end',
    marginTop: 20,
  },
  textCadastro: {},
  textError: {
    width: 350,
  },
  button: {
    marginTop: 40,
  },
  buttonOthers: {
    marginTop: 20,
    marginBottom: 30,
  },
  divButtonsImage: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  buttonImage: {
    width: 180,
  },
  textDialog: {
    textAlign: 'center',
  },
});
