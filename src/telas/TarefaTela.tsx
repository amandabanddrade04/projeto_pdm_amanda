import {yupResolver} from '@hookform/resolvers/yup';
import React, {useContext, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {StyleSheet, View} from 'react-native';
import {Button, Dialog, Text, TextInput, useTheme} from 'react-native-paper';
import * as yup from 'yup';
import {TarefaContext} from '../context/TarefaProvider';
import {Tarefa} from '../model/Tarefa';

const requiredMessage = 'Campo obrigatório';
const schema = yup.object().shape({
  nome: yup.string().required(requiredMessage).min(2, 'O nome deve ter ao menos 2 caracteres'),
  descricao: yup
    .string()
    .required(requiredMessage)
    .min(2, 'A Descrição deve ter ao menos 2 caracteres'),
});


export default function TarefaTela({route, navigation}: any) {
  const [tarefa, setTarefa] = useState<Tarefa | null>(route.params.tarefa);
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<any>({
    defaultValues: {
      nome: tarefa?.nome,
      descricao: tarefa?.descricao,
    },
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });
  const [requisitando, setRequisitando] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const [mensagem, setMensagem] = useState({tipo: '', mensagem: ''});
  const [dialogErroVisivel, setDialogErroVisivel] = useState(false);
  const [dialogExcluirVisivel, setDialogExcluirVisivel] = useState(false);
  const {salvar, excluir} = useContext<any>(TarefaContext);
  const [excluindo, setExcluindo] = useState(false);

  async function atualizar(data: Tarefa) {
    data.uid = tarefa?.uid || '';
    setRequisitando(true);
    setAtualizando(true);
    const msg = await salvar(data);
    if (msg === 'ok') {
      setMensagem({
        tipo: 'ok',
        mensagem: 'Show! Operação realizada com sucesso.',
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

  function avisarDaExclusaoPermanenteDoRegistro() {
    setDialogExcluirVisivel(true);
  }

  async function excluirTarefa() {
    setDialogExcluirVisivel(false);
    setRequisitando(true);
    setExcluindo(true);
    const msg = await excluir(tarefa);
    if (msg === 'ok') {
      setDialogErroVisivel(true);
      setRequisitando(false);
      setAtualizando(false);
      setMensagem({
        tipo: 'ok',
        mensagem: 'A tarefa foi excluída com sucesso.',
      });
    } else {
      setMensagem({tipo: 'erro', mensagem: 'ops! algo deu errado'});
      setDialogErroVisivel(true);
      setRequisitando(false);
      setExcluindo(false);
    }
  }

  return (
    <View style={{...styles.container, backgroundColor: theme.colors.background}}>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.textinput}
            label="Nome"
            placeholder="Digite o nome da tarefa"
            mode="outlined"
            autoCapitalize="words"
            returnKeyType="next"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            right={<TextInput.Icon icon="office-building" />}
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
            label="Descrição"
            placeholder="react, react native, expo"
            mode="outlined"
            autoCapitalize="words"
            returnKeyType="next"
            keyboardType="default"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            right={<TextInput.Icon icon="rocket-launch" />}
          />
        )}
        name="descrição"
      />
      {errors.descricao && (
        <Text style={{...styles.textError, color: theme.colors.error}}>
          {errors.descricao?.message?.toString()}
        </Text>
      )}
      <Button
        style={styles.button}
        mode="contained"
        onPress={handleSubmit(atualizar)}
        loading={requisitando}
        disabled={requisitando}>
        {!atualizando ? 'Salvar' : 'Salvando'}
      </Button>
      <Button
        style={styles.buttonOthers}
        mode="outlined"
        onPress={handleSubmit(avisarDaExclusaoPermanenteDoRegistro)}
        loading={requisitando}
        disabled={requisitando}>
        {!excluindo ? 'Excluir' : 'Excluindo'}
      </Button>
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
          <Button onPress={excluirTarefa}>Excluir</Button>
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
