import React, {useState, useContext} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Image, StyleSheet, View, FlatList} from 'react-native';
import {Button, Dialog, Text, TextInput, useTheme} from 'react-native-paper';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {ImageLibraryOptions, launchCamera, launchImageLibrary} from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {useNavigation} from '@react-navigation/native';
import {DependenteContext} from '../context/DependenteProvider';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type RootStackParamList = {
  DependenteTela: {dependente?: Dependente};
  SelecionarTarefaTela: {dependenteId: string};
};

type Dependente = {
  uid?: string;
  nome: string;
  email: string;
  senha: string;
  urlFoto?: string;
};

type FormData = {
  nome: string;
  email: string;
  senha: string;
};

const schema = yup.object().shape({
  nome: yup.string().required('Campo obrigatório').min(3, 'O nome deve ter ao menos 3 caracteres'),
  email: yup.string().required('Campo obrigatório').email('Email inválido'),
  senha: yup
    .string()
    .required('Campo obrigatório')
    .min(6, 'A senha deve ter ao menos 6 caracteres'),
});

export default function DependenteTela() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {dependente} = useContext<any>(DependenteContext);
  const [urlDevice, setUrlDevice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({tipo: '', mensagem: ''});
  const [dialogVisivel, setDialogVisivel] = useState(false);
  const [confirmarExclusaoVisivel, setConfirmarExclusaoVisivel] = useState(false);
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>({
    defaultValues: {
      nome: dependente?.nome || '',
      email: dependente?.email || '',
      senha: dependente?.senha || '',
    },
    resolver: yupResolver(schema),
  });

  const buscaNaGaleria = () => {
    const options: ImageLibraryOptions = {mediaType: 'photo'};
    launchImageLibrary(options, response => {
      if (response.assets?.[0]?.uri) setUrlDevice(response.assets[0].uri);
    });
  };

  const tiraFoto = () => {
    const options: ImageLibraryOptions = {mediaType: 'photo'};
    launchCamera(options, response => {
      if (response.assets?.[0]?.uri) setUrlDevice(response.assets[0].uri);
    });
  };

  const uploadFoto = async (): Promise<string> => {
    if (!urlDevice)
      return (
        dependente?.urlFoto || 'https://www.gravatar.com/avatar/00000000000000000000000000000000'
      );
    const response = await fetch(urlDevice);
    const blob = await response.blob();
    const filename = `dependentes/${auth().currentUser?.uid}_${Date.now()}.jpg`;
    await storage().ref(filename).put(blob);
    return await storage().ref(filename).getDownloadURL();
  };

  const cadastrarDependente = async (data: FormData) => {
    setLoading(true);
    try {
      const responsavelId = auth().currentUser?.uid;
      if (!responsavelId) throw new Error('Usuário não autenticado');
      const urlFoto = await uploadFoto();
      await firestore()
        .collection('dependentes')
        .add({
          ...data,
          urlFoto,
          responsavelId,
        });
      setMensagem({tipo: 'ok', mensagem: 'Dependente cadastrado com sucesso!'});
    } catch (err: any) {
      setMensagem({tipo: 'erro', mensagem: err.message});
    } finally {
      setLoading(false);
      setDialogVisivel(true);
    }
  };

  const atualizarDependente = async (data: FormData) => {
    setLoading(true);
    try {
      if (!dependente?.uid) throw new Error('ID do dependente não encontrado');
      const urlFoto = await uploadFoto();
      await firestore()
        .collection('dependentes')
        .doc(dependente.uid)
        .update({
          ...data,
          urlFoto,
        });
      setMensagem({tipo: 'ok', mensagem: 'Dependente atualizado com sucesso!'});
    } catch (err: any) {
      setMensagem({tipo: 'erro', mensagem: err.message});
    } finally {
      setLoading(false);
      setDialogVisivel(true);
    }
  };

  const deletarDependente = async () => {
    try {
      if (!dependente?.uid) throw new Error('ID do dependente não encontrado');

      await firestore().collection('dependentes').doc(dependente.uid).delete();

      // Se quiser também apagar do Storage (foto), você pode:
      // if (dependente.urlFoto) {
      //   const ref = storage().refFromURL(dependente.urlFoto);
      //   await ref.delete();
      // }

      setMensagem({tipo: 'ok', mensagem: 'Dependente excluído com sucesso!'});
      setDialogVisivel(true);

      // Após curto tempo, voltar para tela anterior
      setTimeout(() => navigation.goBack(), 2000);
    } catch (err: any) {
      setMensagem({tipo: 'erro', mensagem: err.message});
      setDialogVisivel(true);
    }
  };

  return (
    <View style={{...styles.container, backgroundColor: theme.colors.background}}>
      <FlatList
        data={[{key: 'form'}]}
        renderItem={() => (
          <View>
            <Image
              source={
                urlDevice
                  ? {uri: urlDevice}
                  : dependente?.urlFoto
                  ? {uri: dependente.urlFoto}
                  : require('../assets/images/person.png')
              }
              style={styles.image}
            />
            <View style={styles.divButtonsImage}>
              <Button
                mode="outlined"
                icon="image"
                style={styles.buttonImage}
                onPress={buscaNaGaleria}>
                Galeria
              </Button>
              <Button mode="outlined" icon="camera" style={styles.buttonImage} onPress={tiraFoto}>
                Foto
              </Button>
            </View>

            <Controller
              control={control}
              name="nome"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label="Nome"
                  mode="outlined"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={styles.textinput}
                />
              )}
            />
            {errors.nome?.message && <Text style={styles.textError}>{errors.nome.message}</Text>}

            <Controller
              control={control}
              name="email"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label="Email"
                  mode="outlined"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={styles.textinput}
                />
              )}
            />
            {errors.email?.message && <Text style={styles.textError}>{errors.email.message}</Text>}

            <Controller
              control={control}
              name="senha"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  label="Senha"
                  mode="outlined"
                  secureTextEntry
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={styles.textinput}
                />
              )}
            />
            {errors.senha?.message && <Text style={styles.textError}>{errors.senha.message}</Text>}

            <Button
              mode="contained"
              style={styles.button}
              loading={loading}
              onPress={handleSubmit(dependente ? atualizarDependente : cadastrarDependente)}>
              {dependente ? 'Atualizar Dependente' : 'Cadastrar Dependente'}
            </Button>

            {dependente?.uid && (
              <Button
                mode="outlined"
                style={[styles.button, {borderColor: 'red'}]}
                textColor="red"
                onPress={() => setConfirmarExclusaoVisivel(true)}>
                Excluir Dependente
              </Button>
            )}
          </View>
        )}
      />

      <Dialog visible={dialogVisivel} onDismiss={() => setDialogVisivel(false)}>
        <Dialog.Icon icon={mensagem.tipo === 'ok' ? 'check-circle' : 'alert-circle'} size={60} />
        <Dialog.Title>{mensagem.tipo === 'ok' ? 'Sucesso' : 'Erro'}</Dialog.Title>
        <Dialog.Content>
          <Text>{mensagem.mensagem}</Text>
        </Dialog.Content>
      </Dialog>

      <Dialog
        visible={confirmarExclusaoVisivel}
        onDismiss={() => setConfirmarExclusaoVisivel(false)}>
        <Dialog.Title>Confirmar Exclusão</Dialog.Title>
        <Dialog.Content>
          <Text>Tem certeza que deseja excluir este dependente?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setConfirmarExclusaoVisivel(false)}>Cancelar</Button>
          <Button
            onPress={() => {
              setConfirmarExclusaoVisivel(false);
              deletarDependente(); // Chama a função de exclusão aqui
            }}>
            Confirmar
          </Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    marginTop: 20,
    width: 350,
  },
  buttonImage: {
    width: 180,
  },
  textinput: {
    width: 350,
    height: 50,
    marginTop: 20,
    backgroundColor: 'transparent',
  },
  textError: {
    width: 350,
    color: 'red',
  },
  tarefaContainer: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginTop: 10,
  },
  divButtonsImage: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },

  tarefaCard: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  tarefaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tarefaCategoria: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  tarefaPontos: {
    fontSize: 14,
    color: '#00796B',
    marginTop: 2,
  },
});
