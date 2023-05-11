import type { User } from "next-auth";
import type { Chatroom } from "@prisma/client";

export type TChatroom = (Chatroom & { messages: Message[]; users: User[] })[];

export interface Message {
  id: number;
  text: string;
  user: User;
  userId: number;
  chatroomId: number;
  chatroom: Chatroom;
  createdAt: Date;
}

export interface FriendRequest {
  id: number;
  senderId: number;
  receiverId: number;
  isAccepted: boolean;
  createdAt: Date;
  sender: User;
  receiver: User;
}
