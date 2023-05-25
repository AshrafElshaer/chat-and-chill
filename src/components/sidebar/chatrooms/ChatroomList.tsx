import { useSession } from "next-auth/react";

import { type SetState } from "../Sidebar";
import type { Chatroom, Message, User } from "@prisma/client";

import Link from "next/link";
import ChatroomPreview from "./ChatroomPreview";

type Props = {
  chatrooms: (Chatroom & { messages: Message[]; users: User[] })[];
  setIsSidebarOpen: SetState<boolean>;
  selectedTab: "chatrooms" | "friends";
};

const ChatroomList = ({ chatrooms, setIsSidebarOpen, selectedTab }: Props) => {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <ul
      className={`scrollbar-hide  
     h-full
       w-full 
      transform overflow-y-scroll  font-medium
      
      transition-transform duration-300 md:h-[80vh]
      ${selectedTab === "friends" ? "-translate-x-full" : ""}`}
    >
      {chatrooms.map((chatroom) => (
        <Link
          href={`/chatroom/${chatroom.id}`}
          key={chatroom.id}
          onClick={() => setIsSidebarOpen(false)}
        >
          <ChatroomPreview room={chatroom} session={session} />
        </Link>
      ))}
    </ul>
  );
};

export default ChatroomList;
