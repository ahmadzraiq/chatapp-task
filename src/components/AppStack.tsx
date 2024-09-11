import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { UserStatusProvider } from "../context/UserStatusContext";
import ActiveUsersScreen from "../screens/ActiveUsersScreen";
import ChatScreen from "../screens/ChatScreen";

const Stack = createStackNavigator();

const AppStack = () => (
  <UserStatusProvider>
    <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen name='Chat' component={ChatScreen} />
      <Stack.Screen name='ActiveUsers' component={ActiveUsersScreen} options={{ title: "Active Users" }} />
    </Stack.Navigator>
  </UserStatusProvider>
);

export default AppStack;
