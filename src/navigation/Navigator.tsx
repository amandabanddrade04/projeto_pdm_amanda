import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import SignIn from '../telas/SignIn';
import {Icon, useTheme} from 'react-native-paper';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StatusBar, StyleSheet} from 'react-native';
import Preload from '../telas/Preload';
import SignUp from '../telas/SignUp';
import EsqueceuSenha from '../telas/EsqueceuSenha';
import Menu from '../telas/Menu';
import Perfil from '../telas/PerfilTela';
import AlteraSenha from '../telas/AlteraSenha';
import TarefaTela from '../telas/TarefaTela';
import Dependentes from '../telas/Dependentes';
import SelecionarTarefaTela from '../telas/SelecionarTarefaTela';
import DependentesTarefas from '../telas/DependentesTarefas';
import GerenciarCategorias from '../telas/GerenciarCategorias';
import GerenciarTarefas from '../telas/GerenciarTarefas';
import {View} from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const TarefasStack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator initialRouteName="Preload" screenOptions={{headerShown: false}}>
    <Stack.Screen name="Preload" component={Preload} />
    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="SignUp" component={SignUp} />
    <Stack.Screen name="EsqueceuSenha" component={EsqueceuSenha} />
    <Stack.Screen name="SelecionarTarefaTela" component={SelecionarTarefaTela} />
  </Stack.Navigator>
);

const TarefasStackNavigator = () => (
  <TarefasStack.Navigator screenOptions={{headerShown: false}}>
    <TarefasStack.Screen name="ListaTarefas" component={DependentesTarefas} />
    <TarefasStack.Screen name="SelecionarTarefa" component={SelecionarTarefaTela} />
  </TarefasStack.Navigator>
);

const DependenteStack = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="TarefasDoDependente"
      screenOptions={{
        tabBarActiveTintColor: '#36A1D9',
        tabBarInactiveTintColor: '#CC6668',
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 1,
          left: 20,
          right: 20,
          backgroundColor: '#ffffff',
          height: 60,
          ...styles.shadow,
        },
      }}>
      <Tab.Screen
        // 3. A aba "Tarefas" agora renderiza a pilha de tarefas, e não uma tela só
        name="TarefasDoDependente"
        component={TarefasStackNavigator}
        options={{
          tabBarLabel: 'Tarefas',
          tabBarIcon: () => (
            <Icon source="clipboard-list-outline" color={theme.colors.primary} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="PerfilDependente"
        component={Perfil}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: () => <Icon source="account" color={theme.colors.primary} size={20} />,
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
        tabBarActiveTintColor: '#36A1D9',
        tabBarInactiveTintColor: '#CC6668',
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 1,
          left: 20,
          right: 20,
          backgroundColor: '#ffffff',
          height: 55,
          paddingTop: 10,
          ...styles.shadow,
        },
      }}>
      <Tab.Screen
        component={Dependentes}
        name="Dependentes"
        options={{
          tabBarLabel: 'Dependentes',
          tabBarIcon: ({color, size}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Icon source="home" color={color} size={size} />,
            </View>
          ),
        }}
      />
      <Tab.Screen
        component={TarefaTela}
        name="Tarefas"
        options={{
          tabBarLabel: 'Tarefas',
          tabBarIcon: ({color, size}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Icon source="clipboard-list-outline" color={color} size={size} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        component={Menu}
        name="Menu"
        options={{
          tabBarLabel: 'Menu',
          tabBarIcon: ({color, size}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Icon source="account-circle-outline" color={color} size={size} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

const AdminTab = createBottomTabNavigator();
const AdminStack = () => (
  <AdminTab.Navigator screenOptions={{headerShown: false}}>
    <AdminTab.Screen
      name="GerenciarTarefas"
      component={GerenciarTarefas}
      options={{
        tabBarIcon: ({color, size}) => <Icon source="clipboard-list" color={color} size={size} />,
      }}
    />
    <AdminTab.Screen
      name="GerenciarCategorias"
      component={GerenciarCategorias}
      options={{
        tabBarIcon: ({color, size}) => <Icon source="folder-multiple" color={color} size={size} />,
      }}
    />
    <AdminTab.Screen
      name="MenuAdmin"
      component={Menu}
      options={{
        title: 'Menu',
        tabBarIcon: ({color, size}) => <Icon source="menu" color={color} size={size} />,
      }}
    />
  </AdminTab.Navigator>
);

export default function Navigator() {
  const theme = useTheme();
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={theme.dark ? theme.colors.surface : theme.colors.primary} />
      <Stack.Navigator initialRouteName="AuthStack" screenOptions={{headerShown: false}}>
        <Stack.Screen name="AuthStack" component={AuthStack} />
        <Stack.Screen name="AppStack" component={AppStack} />
        <Stack.Screen name="DependenteStack" component={DependenteStack} />
        <Stack.Screen name="AdminStack" component={AdminStack} />

        {/* Telas que podem ser chamadas por cima de tudo */}
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="AlteraSenha" component={AlteraSenha} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
