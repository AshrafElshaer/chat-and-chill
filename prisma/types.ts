// import type { User } from "next-auth";

interface User {
    id: number;
    // email: string;
    // username?: string;
    name:string;
    image: string;
    // bio?: string;
    // ...other properties
    // role: UserRole;
    }
export interface Chatroom {
  id: number;
  messages: Message[];
  users: User[];
}

export interface Message {
  id: number;
  text: string;
//   user: User;
  userId: number;
  chatroomId: number;
//   chatroom: Chatroom;
  createdAt: string;
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





