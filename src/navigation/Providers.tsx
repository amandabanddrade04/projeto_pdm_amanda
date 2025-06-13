import React from 'react';
import Navigator from './Navigator';
import {AuthProvider} from '../context/AuthProvider';
import {UserProvider} from '../context/UserProvider';
import {DependenteProvider} from '../context/DependenteProvider';
import {MD3LightTheme as DefaultTheme, MD3DarkTheme, PaperProvider} from 'react-native-paper';
import {TarefaProvider} from '../context/TarefaProvider';
import {CategoriaProvider} from '../context/CategoriaProvider';

export const meuTemaClaro = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#000000', // cor principal
    secondary: '#000000', // cor secundária
    background: '#ffffff',
    surface: '#ffffff',
    text: '#000000',
    onPrimary: '#FFFFFF',
  },
};

export const meuTemaEscuro = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#81C784',
    secondary: '#FFD54F',
    background: '#303030',
    surface: '#424242',
    text: '#FFFFFF',
    onPrimary: '#000000',
  },
};
const temaDoApp = true;

export default function Providers() {
  return (
    <AuthProvider>
      <UserProvider>
        <DependenteProvider>
          <TarefaProvider>
            <CategoriaProvider>
              {/* Usando o tema claro ou escuro baseado na variável temaDoApp */}
            <PaperProvider theme={temaDoApp ? meuTemaClaro : meuTemaEscuro}>
              <Navigator />
            </PaperProvider>
            </CategoriaProvider>
          </TarefaProvider>
        </DependenteProvider>
      </UserProvider>
    </AuthProvider>
  );
}
