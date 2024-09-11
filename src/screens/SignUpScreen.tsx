import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Button, ScrollView, Text, TextInput, View } from "react-native";
import * as yup from "yup";
import { useAuth } from "../context/AuthContext"; // Get the signUp function from the AuthContext
import { styles } from "../styles/SignUpScreenStyles";

const signupSchema = yup.object().shape({
  username: yup.string().required("Username is required").min(3, "Username must be at least 3 characters"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm password is required"),
});

const SignUpScreen = ({ navigation }: { navigation: any }) => {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setFirebaseError(null);

    try {
      await signUp(data.email, data.password, data.username);
      navigation.navigate("Chat");
    } catch (error: any) {
      // Firebase error handling
      switch (error.code) {
        case "auth/email-already-in-use":
          setFirebaseError("The email address is already in use by another account.");
          break;
        case "auth/invalid-email":
          setFirebaseError("The email address is not valid.");
          break;
        case "auth/weak-password":
          setFirebaseError("The password is too weak. Please use a stronger password.");
          break;
        case "auth/operation-not-allowed":
          setFirebaseError("Email/password accounts are not enabled.");
          break;
        case "auth/network-request-failed":
          setFirebaseError("Network error. Please check your internet connection.");
          break;
        case "auth/too-many-requests":
          setFirebaseError("Too many requests. Please try again later.");
          break;
        default:
          setFirebaseError("Failed to sign up. Please try again later.");
          break;
      }
      console.error("Sign up error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        {firebaseError && <Text style={styles.error}>{firebaseError}</Text>}

        <Controller
          control={control}
          name='username'
          render={({ field: { onChange, value } }) => (
            <TextInput style={styles.input} placeholder='Username' value={value} onChangeText={onChange} />
          )}
        />
        {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}

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

        <Controller
          control={control}
          name='confirmPassword'
          render={({ field: { onChange, value } }) => (
            <TextInput style={styles.input} placeholder='Confirm Password' secureTextEntry value={value} onChangeText={onChange} />
          )}
        />
        {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}

        <Button title='Sign Up' onPress={handleSubmit(onSubmit)} disabled={loading} />
        {loading && <ActivityIndicator size='small' />}
        <Text style={styles.loginLink} onPress={() => navigation.navigate("Login")}>
          Already have an account? Log In
        </Text>
      </View>
    </ScrollView>
  );
};

export default SignUpScreen;
