import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    borderRadius: 4,
  },
  error: {
    color: "red",
    marginBottom: 12,
  },
  signupLink: {
    marginTop: 20,
    textAlign: "center",
    color: "#1E90FF",
  },
});
