import Link from "next/link";
import ChatroomPreview from "./ChatroomPreview";
import type { Chatroom, Message, User } from "@prisma/client";
import {type SetState } from "./Sidebar";

type Props = {
  chatrooms: (Chatroom & { messages: Message[]; users: User[] })[];
  setIsSidebarOpen: SetState<boolean>;
};

const ChatroomList = ({ chatrooms, setIsSidebarOpen }: Props) => {

  return (
    <ul className="scrollbar-hide   h-[63vh] overflow-y-scroll font-medium md:h-[80vh]">
      {chatrooms.map((chatroom) => (
        <Link
          href={`/chatroom/${chatroom.id}`}
          key={chatroom.id}
          onClick={() => setIsSidebarOpen(false)}
        >
          <ChatroomPreview room={chatroom} />
        </Link>
      ))}
    </ul>
  );
};

export default ChatroomList;
