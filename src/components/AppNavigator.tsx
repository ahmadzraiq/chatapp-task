import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { useAuth } from "../context/AuthContext";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import LoadingScreen from "./LoadingScreen";

const MainNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return <NavigationContainer>{user ? <AppStack /> : <AuthStack />}</NavigationContainer>;
};

export default MainNavigator;
