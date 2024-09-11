import React from "react";
import { FlatList, Text, View } from "react-native";
import { useUserStatus } from "../context/UserStatusContext";
import { styles } from "../styles/ActiveUsersScreenStyles";

const ActiveUsersScreen = () => {
  const { onlineStatusMap } = useUserStatus(); // Get the online status map from context

  // Get the list of all users who are online
  const activeUsers = Object.entries(onlineStatusMap)
    .filter(([userId, isOnline]) => isOnline)
    .map(([userId, data]) => data?.username);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Active Users</Text>
      <FlatList
        data={activeUsers}
        keyExtractor={item => item}
        renderItem={({ item }) => <Text style={styles.user}>{item}</Text>}
        ListEmptyComponent={<Text>No active users</Text>}
      />
    </View>
  );
};

export default ActiveUsersScreen;
