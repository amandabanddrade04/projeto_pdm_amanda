import React, {useContext, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {Button, Dialog, Text, TextInput, useTheme} from 'react-native-paper';
import {Usuario} from '../model/Usuario';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {ImageLibraryOptions, launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Dependente} from '../model/Dependente';
import {DependenteContext} from '../context/DependenteProvider';

const requiredMessage = 'Campo obrigatório';

const schema = yup.object().shape({
  nome: yup.string().required(requiredMessage).min(3, 'O nome deve ter ao menos 3 caracteres'),
  email: yup.string().required(requiredMessage).email('Email inválido'),
});

export default function DependenteTela({route, navigation}: any) {
  const [dependente, setDependente] = useState<Dependente | null>(route.params.dependente);
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<any>({
    defaultValues: {
      nome: dependente?.nome,
      email: dependente?.email,
    },
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const [requisitando, setRequisitando] = useState(false);
  const [urlDevice, setUrlDevice] = useState<string | undefined>('');
  const [atualizando, setAtualizando] = useState(false);
  const [mensagem, setMensagem] = useState({tipo: '', mensagem: ''});
  const [dialogErroVisivel, setDialogErroVisivel] = useState(false);
  const [dialogExcluirVisivel, setDialogExcluirVisivel] = useState(false);
  const {salvar, excluir} = useContext<any>(DependenteContext);
  const [excluindo, setExcluindo] = useState(false);

  async function atualizarDependente(data: Usuario) {
    console.log(data);
    data.uid = dependente?.uid || '';
    data.urlFoto =
      dependente?.urlFoto || 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50';
    setRequisitando(true);
    setAtualizando(true);
    console.log(data);
    const msg = await salvar(data, urlDevice);
    if (msg === 'ok') {
      setMensagem({tipo: 'sucesso', mensagem: 'Dependente atualizado com sucesso!'});
      setDialogErroVisivel(true);
      setRequisitando(false);
      setAtualizando(false);
    } else {
      setMensagem({tipo: 'sucesso', mensagem: msg});
      setDialogErroVisivel(true);
      setRequisitando(false);
      setAtualizando(false);
    }
  }

  function avisarDaExclusaoPermanenteDoRegistro() {
    setDialogExcluirVisivel(true);
  }

  async function excluirDependente() {
    setDialogExcluirVisivel(false);
    setRequisitando(true);
    setExcluindo(true);
    const msg = await excluir(dependente);
    if (msg === 'ok') {
      setDialogErroVisivel(true);
      setRequisitando(false);
      setAtualizando(false);
      setMensagem({
        tipo: 'ok',
        mensagem: 'O Dependente foi excluído com sucesso.',
      });
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
        setUrlDevice(path); //armazena a uri para a imagem no device
      }
    });
  };

  function tiraFoto() {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
    };
    launchCamera(options, response => {
      if (response.errorCode) {
        setMensagem({tipo: 'erro', mensagem: 'Ops! Erro ao tirar a foto'});
      } else if (response.didCancel) {
        setMensagem({tipo: 'ok', mensagem: 'Ok, você cancelou.'});
      } else {
        const path = response.assets?.[0].uri;
        setUrlDevice(path); //armazena a uri para a imagem no device
      }
    });
  }

  return (
    <View style={{...styles.container, backgroundColor: theme.colors.background}}>
      <ScrollView>
        <>
          <Image
            style={styles.image}
            source={
              urlDevice !== ''
                ? {uri: urlDevice}
                : dependente && dependente?.urlFoto !== ''
                ? {uri: dependente?.urlFoto}
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
                autoCapitalize="words"
                returnKeyType="next"
                keyboardType="default"
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
            onPress={handleSubmit(atualizarDependente)}
            loading={requisitando}
            disabled={requisitando}>
            {!atualizando ? 'Atualizar' : 'Atualizando'}
          </Button>
          <Button
            style={styles.buttonOthers}
            mode="outlined"
            onPress={handleSubmit(avisarDaExclusaoPermanenteDoRegistro)}
            loading={requisitando}
            disabled={requisitando}>
            {!excluindo ? 'Excluir' : 'Excluindo'}
          </Button>
        </>
      </ScrollView>
      <Dialog
        visible={dialogExcluirVisivel}
        onDismiss={() => {
          setDialogErroVisivel(false);
          navigation.goBack();
        }}>
        <Dialog.Icon icon={'alert-circle-outline'} size={60} />
        <Dialog.Title style={styles.textDialog}>{'Ops!'}</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.textDialog} variant="bodyLarge">
            {'Você tem certeza que deseja excluir esse registro?\nEsta operação será irreversível.'}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setDialogExcluirVisivel(false)}>Cancelar</Button>
          <Button onPress={excluirDependente}>Excluir</Button>
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
  textError: {
    width: 350,
  },
  button: {
    marginTop: 40,
    width: 350,
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
  buttonOthers: {
    marginTop: 20,
    marginBottom: 30,
    width: 350,
  },
});
