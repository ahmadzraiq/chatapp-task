import { collection, onSnapshot } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../config/firebaseConfig";

interface UserStatusContextType {
  onlineStatusMap: Record<string, any>;
}

const UserStatusContext = createContext<UserStatusContextType | undefined>(undefined);

export const UserStatusProvider = ({ children }: { children: React.ReactNode }) => {
  const [onlineStatusMap, setOnlineStatusMap] = useState<Record<string, any>>({});

  useEffect(() => {
    // Subscribe to Firestore for real-time updates of user status
    const unsubscribe = onSnapshot(collection(db, "users"), snapshot => {
      const statusMap: Record<string, any> = {};
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.online) {
          statusMap[doc.id] = data;
        } else {
          delete statusMap[doc.id];
        }
      });
      setOnlineStatusMap(statusMap); // Update the online status map
    });

    return () => unsubscribe(); // Cleanup Firestore listener when component unmounts
  }, []);

  return <UserStatusContext.Provider value={{ onlineStatusMap }}>{children}</UserStatusContext.Provider>;
};

export const useUserStatus = (): UserStatusContextType => {
  const context = useContext(UserStatusContext);
  if (!context) {
    throw new Error("useUserStatus must be used within a UserStatusProvider");
  }
  return context;
};
