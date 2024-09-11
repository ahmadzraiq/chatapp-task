import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name='Login' component={LoginScreen} />
    <Stack.Screen name='SignUp' component={SignUpScreen} />
  </Stack.Navigator>
);

export default AuthStack;
