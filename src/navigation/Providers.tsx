import React from 'react';
import Navigator from './Navigator';
import {AuthProvider} from '../context/AuthProvider';
import {UserProvider} from '../context/UserProvider';
import {DependenteProvider} from '../context/DependenteProvider';
import {MD3LightTheme as DefaultTheme, PaperProvider} from 'react-native-paper';
import {TarefaProvider} from '../context/TarefaProvider';
import {CategoriaProvider} from '../context/CategoriaProvider';

const themeColors = {
  primary: '#CC6668',
  secondary: '#F2EF7B',
  background: '#FDF7F8', // Um fundo branco com um leve tom de rosa
  text: '#343A40', // Texto escuro, quase preto
  surface: '#FFFFFF', // Fundo de cards e inputs
  outline: '#DEE2E6', // Borda de inputs
  placeholder: '#6C757D', // Cor para textos de placeholder
};

export const appTheme = {
  ...DefaultTheme,
  roundness: 16, // Bordas mais arredondadas
  colors: {
    ...DefaultTheme.colors,
    primary: themeColors.primary,
    onPrimary: themeColors.text, // Cor do texto em cima da cor primária
    background: themeColors.background,
    surface: themeColors.surface,
    text: themeColors.text,
    onSurface: themeColors.text,
    outline: themeColors.outline,
    placeholder: themeColors.placeholder,
    primaryContainer: themeColors.primary,
    secondaryContainer: themeColors.secondary,
    onSecondaryContainer: '#FFFFFF',
  },
};

export default function Providers() {
  return (
    <AuthProvider>
      <UserProvider>
        <DependenteProvider>
          <TarefaProvider>
            <CategoriaProvider>
              <PaperProvider theme={appTheme}>
                <Navigator />
              </PaperProvider>
            </CategoriaProvider>
          </TarefaProvider>
        </DependenteProvider>
      </UserProvider>
    </AuthProvider>
  );
}
