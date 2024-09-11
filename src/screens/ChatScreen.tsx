import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Button, FlatList, KeyboardAvoidingView, Platform, Text, View } from "react-native";
import RenderMessage from "../components/RenderMessage";
import SendMessageInput from "../components/SendMessageInput";
import { useAuth } from "../context/AuthContext";
import { loadMoreMessagesPaginated, subscribeToMessagesPaginated } from "../services/chatService";
import { styles } from "../styles/ChatScreenStyles";
import { Message } from "../types/Message";

const ChatScreen = () => {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: 10 }}>
          <Button title='Logout' onPress={logout} />
        </View>
      ),
    });
  }, [navigation, logout]);

  useEffect(() => {
    const unsubscribe = subscribeToMessagesPaginated((fetchedMessages, lastVisibleDoc, moreAvailable) => {
      setMessages(fetchedMessages);
      setLastVisible(lastVisibleDoc);
      setHasMore(moreAvailable);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadMoreMessages = useCallback(async () => {
    if (!lastVisible || loadingMore || !hasMore) return;

    setLoadingMore(true);
    const { moreMessages, lastVisibleDoc, hasMore: moreAvailable } = await loadMoreMessagesPaginated(lastVisible);
    setMessages(prevMessages => [...prevMessages, ...moreMessages]);
    setLastVisible(lastVisibleDoc);
    setHasMore(moreAvailable);
    setLoadingMore(false);
  }, [lastVisible, loadingMore, hasMore]);

  const renderItem = useCallback(
    ({ item }: { item: Message }) => {
      const isCurrentUser = item.senderID === user?.uid;
      return <RenderMessage item={item} isCurrentUser={isCurrentUser} />;
    },
    [user]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' />
        <Text>Loading messages...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        inverted
        contentContainerStyle={styles.flatListContent}
        ListFooterComponent={loadingMore ? <ActivityIndicator size='small' /> : null}
        onEndReached={hasMore ? loadMoreMessages : null}
        onEndReachedThreshold={0.1}
      />

      <SendMessageInput userId={user?.uid} />
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
