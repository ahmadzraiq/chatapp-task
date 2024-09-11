import { Timestamp } from "firebase/firestore";
import React, { useCallback } from "react";
import { Text, View } from "react-native";
import { styles } from "../styles/ChatScreenStyles";
import { Message } from "../types/Message";

const RenderMessage = React.memo(({ item, isCurrentUser }: { item: Message; isCurrentUser: boolean }) => {
  const formatTimestamp = useCallback((timestamp: Timestamp | Date | null | undefined): string => {
    if (!timestamp) return new Date().toLocaleString();
    if (timestamp instanceof Timestamp) return timestamp.toDate().toLocaleString();
    if (timestamp instanceof Date) return timestamp.toLocaleString();
    return "Invalid timestamp";
  }, []);

  return (
    <View style={[styles.messageContainer, isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage]}>
      {!isCurrentUser && <Text style={styles.senderName}>Guest</Text>}
      <Text style={styles.messageText}>{item.messageText}</Text>
      <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
    </View>
  );
});

export default RenderMessage;
