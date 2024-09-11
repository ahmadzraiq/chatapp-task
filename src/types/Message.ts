// src/types/Message.ts
import { Timestamp } from "firebase/firestore";

export type Message = {
  senderName: string;
  id: string;
  senderID: string;
  receiverID: string;
  messageText: string;
  timestamp: Timestamp | null | undefined;
};
