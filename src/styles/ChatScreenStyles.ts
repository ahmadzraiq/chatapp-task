import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "80%",
    alignSelf: "flex-start",
  },
  currentUserMessage: {
    backgroundColor: "#dcf8c6",
    alignSelf: "flex-end",
  },
  otherUserMessage: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
    color: "#000",
  },
  timestamp: {
    fontSize: 10,
    color: "#666",
    textAlign: "right",
    marginTop: 5,
  },
  senderName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 5,
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: "#fff",
  },
});
