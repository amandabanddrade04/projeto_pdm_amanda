import {yupResolver} from '@hookform/resolvers/yup';
import {CommonActions} from '@react-navigation/native';
import React, {useContext, useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {ImageLibraryOptions, launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {ActivityIndicator, Button, Dialog, Text, TextInput, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as yup from 'yup';
import {AuthContext} from '../context/AuthProvider';
import {UserContext} from '../context/UserProvider';
import {Usuario} from '../model/Usuario';

const requiredMessage = 'Campo obrigatório';

const schema = yup
  .object()
  .shape({
    nome: yup.string().required(requiredMessage).min(2, 'O nome deve ter ao menos 2 caracteres'),
  })
  .required();

export default function PerfilTela({navigation}: any) {

  const {userAuth, signOut} = useContext<any>(AuthContext);
  const {update} = useContext<any>(UserContext);
  const theme = useTheme();
  const [requisitando, setRequisitando] = useState(false);
  const [dialogVisivel, setDialogVisivel] = useState(false);
  const [mensagem, setMensagem] = useState({tipo: '', mensagem: ''});
  const [urlDevice, setUrlDevice] = useState<string | undefined>('');

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset, // Obtenha a função 'reset' do useForm
  } = useForm<any>({
    // Inicie com valores vazios para evitar erros
    defaultValues: {
      nome: '',
      email: '',
      perfil: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });

// Use useEffect para atualizar o formulário quando userAuth carregar ---
  useEffect(() => {
    if (userAuth) {
      // Quando userAuth tiver dados, atualize os valores do formulário
      reset({
        nome: userAuth.nome,
        email: userAuth.email,
        perfil: userAuth.perfil,
      });
    }
  }, [userAuth, reset]); // Este efeito roda sempre que userAuth ou reset mudarem

  // --- CORREÇÃO 3: A verificação condicional agora só decide o que RENDERIZAR ---
  if (!userAuth) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  async function atualizaPerfil(data: Usuario) {
    setRequisitando(true);
    // Usa a função 'update' do UserContext, passando os dados e a URL da nova imagem
    const msg = await update(data, urlDevice);
    if (msg === 'ok') {
      setMensagem({
        tipo: 'ok',
        mensagem: 'Seu perfil foi atualizado com sucesso!',
      });
    } else {
      setMensagem({tipo: 'erro', mensagem: msg});
    }
    setDialogVisivel(true);
    setRequisitando(false);
  }

  async function sair() {
    if (await signOut()) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'AuthStack'}],
        }),
      );
    } else {
      setMensagem({tipo: 'erro', mensagem: 'Ocorreu um erro ao tentar sair.'});
      setDialogVisivel(true);
    }
  }

  const buscaNaGaleria = () => {
    const options: ImageLibraryOptions = {mediaType: 'photo'};
    launchImageLibrary(options, response => {
      if (response.assets?.[0].uri) {
        setUrlDevice(response.assets[0].uri);
      }
    });
  };

  function tiraFoto() {
    const options: ImageLibraryOptions = {mediaType: 'photo'};
    launchCamera(options, response => {
      if (response.assets?.[0].uri) {
        setUrlDevice(response.assets[0].uri);
      }
    });
  }

  return (
    <SafeAreaView style={{...styles.container, backgroundColor: theme.colors.background}}>
      <ScrollView>
        <Image
          style={styles.image}
          source={
            urlDevice
              ? {uri: urlDevice}
              : userAuth.urlFoto
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
          name="nome"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.textinput}
              label="Nome"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />
        {errors.nome && (
          <Text style={{...styles.textError, color: theme.colors.error}}>
            {errors.nome?.message?.toString()}
          </Text>
        )}

        <Controller
          control={control}
          name="email"
          render={({field: {value}}) => (
            <TextInput style={styles.textinput} disabled label="Email" value={value} />
          )}
        />

        <Button
          style={styles.button}
          mode="contained"
          onPress={handleSubmit(atualizaPerfil)}
          loading={requisitando}
          disabled={requisitando}>
          Atualizar Perfil
        </Button>

        {/* --- NOVO BOTÃO DE SAIR --- */}
        <Button
          style={styles.buttonOthers}
          mode="outlined"
          onPress={sair}
          loading={requisitando}
          disabled={requisitando}>
          Sair do Aplicativo
        </Button>
      </ScrollView>

      {/* Dialog para mostrar mensagens de erro ou sucesso */}
      <Dialog visible={dialogVisivel} onDismiss={() => setDialogVisivel(false)}>
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
        <Dialog.Actions>
          <Button onPress={() => setDialogVisivel(false)}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    </SafeAreaView>
  );
}

// Estilos existentes (sem necessidade de alteração)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    borderRadius: 100,
    marginTop: 50,
  },
  textinput: {
    width: 350,
    height: 50,
    marginTop: 20,
    backgroundColor: 'transparent',
  },
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
