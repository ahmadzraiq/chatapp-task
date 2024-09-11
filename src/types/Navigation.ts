import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Chat: undefined;
};

export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">;
export type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, "SignUp">;
export type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, "Chat">;
