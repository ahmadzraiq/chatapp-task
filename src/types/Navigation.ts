import { StackNavigationProp } from "@react-navigation/stack";

// Define the types for the screens in the navigation stack
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Chat: undefined;
  ActiveUsers: undefined; // Add ActiveUsers to the navigation stack
};

// Define the navigation props for each screen
export type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">;
export type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, "SignUp">;
export type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, "Chat">;
export type ActiveUsersScreenNavigationProp = StackNavigationProp<RootStackParamList, "ActiveUsers">; // Navigation prop for ActiveUsersScreen
