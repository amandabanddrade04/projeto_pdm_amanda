import React, {useState, useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Image, StyleSheet, View, FlatList} from 'react-native';
import {Button, Dialog, Text, TextInput, useTheme} from 'react-native-paper';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {ImageLibraryOptions, launchCamera, launchImageLibrary} from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const requiredMessage = 'Campo obrigatório';

const schema = yup.object().shape({
  nome: yup.string().required(requiredMessage).min(3, 'O nome deve ter ao menos 3 caracteres'),
  email: yup.string().required(requiredMessage).email('Email inválido'),
  senha: yup.string().required(requiredMessage).min(6, 'A senha deve ter ao menos 6 caracteres'),
});

export default function DependenteTela({navigation}: any) {
  const dependente = navigation.route?.params?.dependente;
  const [tarefas, setTarefas] = useState<any[]>([]);
  const [urlDevice, setUrlDevice] = useState<string | null>(null);
  const [requisitando, setRequisitando] = useState(false);
  const [mensagem, setMensagem] = useState({tipo: '', mensagem: ''});
  const [dialogErroVisivel, setDialogErroVisivel] = useState(false);
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<any>({
    defaultValues: {
      nome: dependente?.nome || '',
      email: dependente?.email || '',
      senha: dependente?.senha || '',
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (dependente?.uid) {
      firestore()
        .collection('tarefas')
        .where('dependenteId', '==', dependente.uid)
        .onSnapshot(snapshot => {
          const tarefasData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTarefas(tarefasData);
        });
    }
  }, [dependente]);

  const adicionarTarefa = () => {
    if (!dependente?.uid) return;

    firestore()
      .collection('tarefas')
      .add({
        dependenteId: dependente.uid,
        descricao: 'Nova tarefa',
        status: 'pendente',
        dataCriacao: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        setMensagem({tipo: 'ok', mensagem: 'Tarefa adicionada com sucesso!'});
      })
      .catch(() => {
        setMensagem({tipo: 'erro', mensagem: 'Erro ao adicionar tarefa'});
      })
      .finally(() => setDialogErroVisivel(true));
  };

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
    const storageRef = storage().ref(filename);

    await storageRef.put(blob);
    return await storageRef.getDownloadURL();
  };

  const atualizarDependente = async (data: any) => {
    setRequisitando(true);
    try {
      if (!dependente?.uid) throw new Error('ID do dependente não encontrado');
      const urlFoto = await uploadFoto();
      await firestore().collection('dependentes').doc(dependente.uid).update({
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        urlFoto,
      });
      setMensagem({tipo: 'ok', mensagem: 'Dependente atualizado com sucesso!'});
    } catch (error: any) {
      setMensagem({tipo: 'erro', mensagem: error.message});
    } finally {
      setDialogErroVisivel(true);
      setRequisitando(false);
    }
  };

  const cadastrarDependente = async (data: any) => {
    setRequisitando(true);
    try {
      const responsavelId = auth().currentUser?.uid;
      if (!responsavelId) throw new Error('Usuário não autenticado');

      const urlFoto = await uploadFoto();
      await firestore().collection('dependentes').add({
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        urlFoto,
        responsavelId,
      });

      setMensagem({tipo: 'ok', mensagem: 'Dependente cadastrado com sucesso!'});
    } catch (error: any) {
      setMensagem({tipo: 'erro', mensagem: error.message});
    } finally {
      setDialogErroVisivel(true);
      setRequisitando(false);
    }
  };

  return (
    <View style={{...styles.container, backgroundColor: theme.colors.background}}>
      <FlatList
        data={[{key: 'form'}]}
        keyExtractor={(item, index) => item.key + index}
        renderItem={() => (
          <View>
            <Image
              style={styles.image}
              source={
                dependente?.urlFoto
                  ? {uri: dependente.urlFoto}
                  : require('../assets/images/person.png')
              }
            />
            <View style={styles.divButtonsImage}>
              <Button
                style={styles.buttonImage}
                mode="outlined"
                icon="image"
                onPress={buscaNaGaleria}>
                Galeria
              </Button>
              <Button style={styles.buttonImage} mode="outlined" icon="camera" onPress={tiraFoto}>
                Foto
              </Button>
            </View>

            {/* Campos de formulário */}
            <Controller
              control={control}
              name="nome"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.textinput}
                  label="Nome"
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.nome?.message && <Text style={styles.textError}>{errors.nome.message}</Text>}

            <Controller
              control={control}
              name="email"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.textinput}
                  label="Email"
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.nome?.message && <Text style={styles.textError}>{errors.nome.message}</Text>}


            <Controller
              control={control}
              name="senha"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.textinput}
                  label="Senha"
                  mode="outlined"
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.nome?.message && <Text style={styles.textError}>{errors.nome.message}</Text>}


            {/* Botões de ação */}
            {dependente ? (
              <Button
                mode="contained"
                style={styles.button}
                onPress={handleSubmit(atualizarDependente)}
                loading={requisitando}>
                Atualizar Dependente
              </Button>
            ) : (
              <Button
                mode="contained"
                style={styles.button}
                onPress={handleSubmit(cadastrarDependente)}
                loading={requisitando}>
                Cadastrar Dependente
              </Button>
            )}

            {/* Botão Adicionar Tarefa */}
            {dependente?.uid && (
              <Button mode="contained" style={styles.button} onPress={adicionarTarefa}>
                Adicionar Tarefa
              </Button>
            )}

            {/* Lista de Tarefas */}
            <FlatList
              data={tarefas}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <View style={styles.tarefaContainer}>
                  <Text>{item.descricao}</Text>
                </View>
              )}
            />
          </View>
        )}
      />

      {/* Dialog de mensagens */}
      <Dialog visible={dialogErroVisivel} onDismiss={() => setDialogErroVisivel(false)}>
        <Dialog.Icon icon={mensagem.tipo === 'ok' ? 'check-circle' : 'alert-circle'} size={60} />
        <Dialog.Title>{mensagem.tipo === 'ok' ? 'Sucesso' : 'Erro'}</Dialog.Title>
        <Dialog.Content>
          <Text>{mensagem.mensagem}</Text>
        </Dialog.Content>
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
});
