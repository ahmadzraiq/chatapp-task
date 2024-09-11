import React, { useCallback, useState } from "react";
import { Button, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { sendMessage } from "../services/chatService";
import sendPushNotification from "../services/sendPushNotification";
import { styles } from "../styles/ChatScreenStyles";

interface SendMessageInputProps {
  userId: string | undefined;
  senderName: string | undefined;
}

const SendMessageInput: React.FC<SendMessageInputProps> = ({ userId, senderName }) => {
  const [newMessage, setNewMessage] = useState<string>("");
  const insets = useSafeAreaInsets();

  const handleSend = useCallback(() => {
    if (newMessage.trim()) {
      sendMessage(userId!, "receiverID_placeholder", newMessage, senderName);
      setNewMessage("");

      // Send a broadcast push notification to all users
      sendPushNotification(newMessage);
    }
  }, [newMessage, userId]);

  return (
    <View style={[styles.inputContainer, { paddingBottom: insets.bottom || 10 }]}>
      <TextInput style={styles.input} placeholder='Type a message' value={newMessage} onChangeText={setNewMessage} />
      <Button title='Send' onPress={handleSend} />
    </View>
  );
};

export default SendMessageInput;
