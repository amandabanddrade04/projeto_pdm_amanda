import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {createContext, useState} from 'react';
import {Credencial} from '../model/types';
import EncryptedStorage from 'react-native-encrypted-storage';
import {Perfil} from '../model/perfil';

// Definindo um tipo para os dados de cadastro para maior clareza
type SignUpData = {
  email: string;
  senha: string;
  nome: string;
  perfil: Perfil;
};

export const AuthContext = createContext({});

export const AuthProvider = ({children}: any) => {
  const [userAuth, setUserAuth] = useState<FirebaseAuthTypes.User | null>(null);

  async function armazenaCredencialnaCache(credencial: Credencial): Promise<void> {
    try {
      await EncryptedStorage.setItem(
        'credencial',
        JSON.stringify({
          email: credencial.email,
          senha: credencial.senha,
        }),
      );
    } catch (e) {
      console.error('AuthProvider, storeCredencial: ' + e);
    }
  }

  async function recuperaCredencialdaCache(): Promise<null | string> {
    try {
      const credencial = await EncryptedStorage.getItem('credencial');
      return credencial ? JSON.parse(credencial) : null;
    } catch (e) {
      console.error('AuthProvider, retrieveUserSession: ' + e);
      return null;
    }
  }

  async function signUp(dadosCadastro: SignUpData): Promise<string> {
    // Verificação de segurança
    if (!dadosCadastro || !dadosCadastro.email || !dadosCadastro.senha) {
      const erroMsg = 'Erro interno: Email ou senha ausentes ao tentar criar usuário.';
      console.error(erroMsg, dadosCadastro); // Log para ver o que chegou
      return erroMsg;
    }

    try {
      // Usando os dados recebidos diretamente
      await auth().createUserWithEmailAndPassword(dadosCadastro.email, dadosCadastro.senha);
      await auth().currentUser?.sendEmailVerification();
      const usuarioFirestore = {
        email: dadosCadastro.email,
        nome: dadosCadastro.nome,
        perfil: dadosCadastro.perfil,
      };
      await firestore().collection('usuarios').doc(auth().currentUser?.uid).set(usuarioFirestore);
      return 'ok';
    } catch (e) {
      console.error('ERRO COMPLETO NO SIGNUP:', e);
      return launchServerMessageErro(e);
    }
  }

  async function signIn(credencial: Credencial): Promise<string> {
    try {
      await auth().signInWithEmailAndPassword(credencial.email, credencial.senha);
      await armazenaCredencialnaCache(credencial);
      return 'ok';
    } catch (e) {
      return launchServerMessageErro(e);
    }
  }

  async function signOut(): Promise<string> {
    try {
      setUserAuth(null);
      await EncryptedStorage.removeItem('credencial');
      if (auth().currentUser) {
        await auth().signOut();
      }
      return 'ok';
    } catch (e) {
      return launchServerMessageErro(e);
    }
  }

  async function recuperarSenha(email: string): Promise<string> {
    try {
      await auth().sendPasswordResetEmail(email);
      return 'ok';
    } catch (e) {
      console.error(e);
      return launchServerMessageErro(e);
    }
  }

  async function alterarSenha(senha: string) {
    try {
      await auth().currentUser?.updatePassword(senha);
      return 'ok';
    } catch (e) {
      console.error('updatePassword: ' + e);
      return launchServerMessageErro(e);
    }
  }

  //função utilitária
  function launchServerMessageErro(e: any): string {
    // Primeiro, verificamos se 'e' e 'e.code' existem
    if (e && e.code) {
      switch (e.code) {
        case 'auth/invalid-credential':
          return 'Email inexistente ou senha errada.';
        case 'auth/user-not-found':
          return 'Usuário não cadastrado.';
        case 'auth/wrong-password':
          return 'Erro na senha.';
        case 'auth/invalid-email':
          return 'Email inválido.';
        case 'auth/user-disabled':
          return 'Usuário desabilitado.';
        case 'auth/email-already-in-use':
          return 'Email já está em uso. Tente outro email.';
        default:
          // Se o código de erro não for reconhecido, mostre o código
          return `Erro desconhecido (${e.code}). Contate o administrador.`;
      }
    }
    // Se 'e' não for um erro do Firebase, mostre a mensagem de erro genérica
    if (e instanceof Error) {
      return e.message;
    }
    return 'Ocorreu um erro inesperado. Contate o administrador';
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        setUserAuth,
        userAuth,
        signOut,
        recuperaCredencialdaCache,
        recuperarSenha,
        alterarSenha,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
