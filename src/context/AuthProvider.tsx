import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {createContext, useState} from 'react';
import {Credencial} from '../model/types';
import {Usuario} from '../model/Usuario';
import EncryptedStorage from 'react-native-encrypted-storage';

export const AuthContext = createContext({});

export const AuthProvider = ({children}: any) => {
  const [userAuth, setUserAuth] = useState<FirebaseAuthTypes.User | null>(null);

  async function armazenaCredencialnaCache(credencial: Credencial): Promise<void> {
    console.log('armazenaCredencialCache');
    console.log(credencial);
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

  async function recuperaCredencialdaCache(): Promise<string | undefined> {
    try {
      const credencial = await EncryptedStorage.getItem('credencial');
      console.log('recuperaCredencialCache');
      console.log(credencial);
      return credencial !== null ? JSON.parse(credencial) : null;
    } catch (e) {
      console.error('AuthProvider, retrieveUserSession: ' + e);
    }
  }

  async function signUp(usuario: Usuario): Promise<string> {
    try {
      await auth().createUserWithEmailAndPassword(usuario.email, usuario.senha);
      await auth().currentUser?.sendEmailVerification();
      const usuarioFirestore = {
        email: usuario.email,
        nome: usuario.nome,
        perfil: usuario.perfil,
      };
      await firestore().collection('usuarios').doc(auth().currentUser?.uid).set(usuarioFirestore);
      return 'ok';
    } catch (e) {
      return launchServerMessageErro(e);
    }
  }

  async function signIn(credencial: Credencial): Promise<string> {
    try {
      if (auth().currentUser?.emailVerified) {
        return 'Você deve validar seu email para continuar.';
      }
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

  //função utilitária
  function launchServerMessageErro(e: any): string {
    switch (e.code) {
      case 'auth/invalid-credential':
        return 'Email inexistente ou senha errada.';
      case 'auth/user-not-found':
        return 'Usuário não cadastrado.';
      case 'auth/wrong-password':
        return 'Erro na senha.';
      case 'auth/invalid-email':
        return 'Email inexistente.';
      case 'auth/user-disabled':
        return 'Usuário desabilitado.';
      case 'auth/email-already-in-use':
        return 'Email em uso. Tente outro email.';
      default:
        return 'Erro desconhecido. Contate o administrador';
    }
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
      }}>
      {children}
    </AuthContext.Provider>
  );
};
