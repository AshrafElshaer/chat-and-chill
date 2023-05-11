import Link from "next/link";
import ChatroomPreview from "../ChatroomPreview";
import type { Chatroom, Message, User } from "@prisma/client";

type Props = {
  chatrooms: (Chatroom & { messages: Message[]; users: User[] })[];
};

const ChatroomList = ({ chatrooms }: Props) => {
  console.log(chatrooms);
  return (
    <ul className="scrollbar-hide   h-[63vh] overflow-y-scroll font-medium md:h-[80vh]">
      {chatrooms.map((chatroom) => (
        <Link href={`/chatroom/${chatroom.id}`} key={chatroom.id}>
          <ChatroomPreview room={chatroom} />
        </Link>
      ))}
    </ul>
  );
};

export default ChatroomList;
