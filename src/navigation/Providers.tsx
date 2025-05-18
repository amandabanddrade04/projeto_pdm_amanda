import React from 'react';
import {MD3DarkTheme, MD3LightTheme, PaperProvider} from 'react-native-paper';
import Navigator from './Navigator';
import {AuthProvider} from '../context/AuthProvider';
import {UserProvider} from '../context/UserProvider';
import {DependenteProvider} from '../context/DependenteProvider';

const themeLight = {
  ...MD3LightTheme,
};

const themeDark = {
  ...MD3DarkTheme,
};

const temaDoApp = true;

export default function Providers() {
  return (
    <AuthProvider>
      <UserProvider>
        <DependenteProvider>
          <PaperProvider theme={temaDoApp ? themeLight : themeDark}>
            <Navigator />
          </PaperProvider>
        </DependenteProvider>
      </UserProvider>
    </AuthProvider>
  );
}
