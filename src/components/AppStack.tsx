import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ChatScreen from "../screens/ChatScreen";

const Stack = createStackNavigator();

const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen name='Chat' component={ChatScreen} />
  </Stack.Navigator>
);

export default AppStack;
