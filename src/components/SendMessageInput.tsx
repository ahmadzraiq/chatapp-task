import React, { useCallback, useState } from "react";
import { Button, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { sendMessage } from "../services/chatService";
import { styles } from "../styles/ChatScreenStyles";

interface SendMessageInputProps {
  userId: string | undefined;
}

const SendMessageInput: React.FC<SendMessageInputProps> = ({ userId }) => {
  const [newMessage, setNewMessage] = useState<string>("");
  const insets = useSafeAreaInsets();

  const handleSend = useCallback(() => {
    if (newMessage.trim()) {
      sendMessage(userId!, "receiverID_placeholder", newMessage);
      setNewMessage("");
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
