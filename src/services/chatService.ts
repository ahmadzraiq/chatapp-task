import { addDoc, collection, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, startAfter } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { Message } from "../types/Message";

// Send a message
export const sendMessage = async (senderID: string, receiverID: string, messageText: string, senderName?: string) => {
  try {
    await addDoc(collection(db, "messages"), {
      senderID,
      receiverID,
      messageText,
      senderName,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

// Subscribe to messages in descending order (initial load)
export const subscribeToMessagesPaginated = (callback: (messages: Message[], lastVisible: any, hasMore: boolean) => void) => {
  const messagesRef = collection(db, "messages");
  const q = query(messagesRef, orderBy("timestamp", "desc"), limit(20));

  return onSnapshot(q, snapshot => {
    const messages: Message[] = [];
    let lastVisible = null;
    let hasMore = true;

    snapshot.forEach(doc => {
      messages.push({ id: doc.id, ...doc.data() } as Message);
    });

    if (snapshot.docs.length > 0) {
      lastVisible = snapshot.docs[snapshot.docs.length - 1];
      hasMore = snapshot.docs.length === 20; // If fewer than 20 messages, stop paginating
    } else {
      hasMore = false;
    }

    callback(messages, lastVisible, hasMore);
  });
};

// Fetch more messages for pagination
export const loadMoreMessagesPaginated = async (lastMessage: any) => {
  const messagesRef = collection(db, "messages");
  const q = query(messagesRef, orderBy("timestamp", "desc"), startAfter(lastMessage), limit(20));

  const snapshot = await getDocs(q);
  const moreMessages: Message[] = [];

  snapshot.forEach(doc => {
    moreMessages.push({ id: doc.id, ...doc.data() } as Message);
  });

  const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
  const hasMore = snapshot.docs.length === 20; // If fewer than 20 messages, stop paginating

  return { moreMessages, lastVisibleDoc, hasMore };
};
