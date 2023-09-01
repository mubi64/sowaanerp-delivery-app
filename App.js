// In App.js in a new project

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
// import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './Screens/HomeScreen';
import DetailsScreen from './Screens/DetailScreen';
import LoginScreen from './Screens/LoginScreen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import SplashScreen from './Screens/SplashScreen';
import {
  GestureHandlerRootView,
  gestureHandlerRootHOC,
} from 'react-native-gesture-handler';
import {View, Button} from 'react-native';
import PostMethod from './NetworkCalls/post';
import { urlForSignUp } from './constant/baseurl';
import GetMethod from './NetworkCalls/get';
const Stack = createNativeStackNavigator();

// const Drawer = createDrawerNavigator();
function App() {
  return (
    <SafeAreaProvider>
    
      <NavigationContainer>
      {/* <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator> */}
      <Stack.Navigator>
      <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={{headerShown: false}}
          />
      </Stack.Navigator>
     <Toast ref={ref => Toast.setRef(ref)} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default gestureHandlerRootHOC(App);
