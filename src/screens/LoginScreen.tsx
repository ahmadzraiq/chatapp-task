import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Button, Text, TextInput, View } from "react-native";
import * as yup from "yup";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles/LoginScreenStyles";

// Yup validation schema for login
const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null); // State to hold Firebase error message

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setFirebaseError(null); // Reset error state before login

    try {
      await login(data.email, data.password);
      navigation.navigate("Chat"); // Navigate to chat if login succeeds
    } catch (error: any) {
      // Firebase error handling
      switch (error.code) {
        case "auth/user-not-found":
          setFirebaseError("No user found with this email.");
          break;
        case "auth/wrong-password":
          setFirebaseError("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          setFirebaseError("The email address is invalid.");
          break;
        case "auth/user-disabled":
          setFirebaseError("This user account has been disabled.");
          break;
        case "auth/too-many-requests":
          setFirebaseError("Too many login attempts. Please try again later.");
          break;
        case "auth/invalid-credential": // Handle the invalid credential error
          setFirebaseError("The credentials provided are invalid. Please check your email and password.");
          break;
        default:
          setFirebaseError("Failed to log in. Please try again later.");
          break;
      }
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {firebaseError && <Text style={styles.error}>{firebaseError}</Text>}

      <Controller
        control={control}
        name='email'
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder='Email' value={value} onChangeText={onChange} />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name='password'
        render={({ field: { onChange, value } }) => (
          <TextInput style={styles.input} placeholder='Password' secureTextEntry value={value} onChangeText={onChange} />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <Button title='Login' onPress={handleSubmit(onSubmit)} disabled={loading} />
      {loading && <ActivityIndicator size='small' />}

      <Text style={styles.signupLink} onPress={() => navigation.navigate("SignUp")}>
        Don't have an account? Sign Up
      </Text>
    </View>
  );
};

export default LoginScreen;
