import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import AppStack from "../components/AppStack";
import AuthStack from "../components/AuthStack";
import LoadingScreen from "../components/LoadingScreen";
import { useAuth } from "../context/AuthContext";

const MainNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return <NavigationContainer>{user ? <AppStack /> : <AuthStack />}</NavigationContainer>;
};

export default MainNavigator;
