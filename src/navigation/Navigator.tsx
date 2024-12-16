/* eslint-disable react/no-unstable-nested-components */
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import SignIn from '../telas/SignIn';
import {Icon, useTheme} from 'react-native-paper';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StatusBar} from 'react-native';
import Preload from '../telas/Preload';
import SignUp from '../telas/SignUp';
import RecuperarSenha from '../telas/RecuperarSenha';
import Responsavel from '../telas/Responsavel';
import Menu from '../telas/Menu';
import Perfil from '../telas/PerfilTela';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator
    initialRouteName="Preload"
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name="Preload" component={Preload} />
    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="SignUp" component={SignUp} />
    <Stack.Screen name="RecuperarSenha" component={RecuperarSenha} />
  </Stack.Navigator>
);

const AppStack = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="Responsavel"
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        component={Responsavel}
        name="Responsavel"
        options={{
          tabBarLabel: 'Responsável',
          tabBarIcon: () => <Icon source="account-group" color={theme.colors.primary} size={20} />,
        }}
      />
      <Tab.Screen
        component={Menu}
        name="Menu"
        options={{
          tabBarLabel: 'Menu',
          tabBarIcon: () => <Icon source="menu" color={theme.colors.primary} size={20} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default function Navigator() {
  const theme = useTheme();

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={theme.colors.primary} />
      <Stack.Navigator
        initialRouteName="AuthStack"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="AuthStack" component={AuthStack} />
        <Stack.Screen name="AppStack" component={AppStack} />
        <Stack.Screen
          component={Responsavel}
          name="Responsavel"
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen name="Perfil" component={Perfil}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
