import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import SignIn from '../telas/SignIn';
import {Icon, useTheme} from 'react-native-paper';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StatusBar} from 'react-native';
import Preload from '../telas/Preload';
import SignUp from '../telas/SignUp';
import EsqueceuSenha from '../telas/EsqueceuSenha';
import Menu from '../telas/Menu';
import Perfil from '../telas/PerfilTela';
import AlteraSenha from '../telas/AlteraSenha';
import TarefaTela from '../telas/TarefaTela';
import Dependentes from '../telas/Dependentes';
import DependenteTela from '../telas/DependenteTela';
import SelecionarTarefaTela from '../telas/SelecionarTarefaTela';
import DependentesTarefas from '../telas/DependentesTarefas';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator initialRouteName="Preload" screenOptions={{headerShown: false}}>
    <Stack.Screen name="Preload" component={Preload} />
    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="SignUp" component={SignUp} />
    <Stack.Screen name="EsqueceuSenha" component={EsqueceuSenha} />
    <Stack.Screen name="SelecionarTarefaTela" component={SelecionarTarefaTela} />
  </Stack.Navigator>
);

const DependenteStack = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="DependentesTarefas"
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {backgroundColor: theme.colors.surface},
      }}>
      <Tab.Screen
        component={DependentesTarefas}
        name="DependentesTarefas"
        options={{
          tabBarLabel: 'Tarefas',
          tabBarIcon: () => (
            <Icon source="account-tie-hat" color={theme.colors.primary} size={20} />
          ),
        }}
      />

      <Tab.Screen
        component={DependenteTela}
        name="DependenteTela"
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: () => <Icon source="menu" color={theme.colors.primary} size={20} />,
        }}
      />
    </Tab.Navigator>
  );
};

const AppStack = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="Dependentes"
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {backgroundColor: theme.colors.surface},
      }}>
      <Tab.Screen
        component={Dependentes}
        name="Dependentes"
        options={{
          tabBarLabel: 'Dependentes',
          tabBarIcon: () => (
            <Icon source="account-tie-hat" color={theme.colors.primary} size={20} />
          ),
        }}
      />
      <Tab.Screen
        component={TarefaTela}
        name="Tarefas"
        options={{
          tabBarLabel: 'Tarefas',
          tabBarIcon: () => (
            <Icon source="office-building-outline" color={theme.colors.primary} size={20} />
          ),
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
      <StatusBar backgroundColor={theme.dark ? theme.colors.surface : theme.colors.primary} />
      <Stack.Navigator initialRouteName="AuthStack" screenOptions={{headerShown: false}}>
        <Stack.Screen name="AuthStack" component={AuthStack} />
        <Stack.Screen name="AppStack" component={AppStack} />
        <Stack.Screen name="TarefaTela" component={TarefaTela} options={{presentation: 'modal'}} />
        <Stack.Screen
          name="DependenteStack"
          component={DependenteStack}
          options={{presentation: 'modal'}}
        />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="AlteraSenha" component={AlteraSenha} />
        <Stack.Screen name="SelecionarTarefaTela" component={SelecionarTarefaTela} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
