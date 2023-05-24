import { useSession } from "next-auth/react";

import { type SetState } from "./Sidebar";
import type { TChatroom } from "prisma/types";

import Link from "next/link";
import ChatroomPreview from "./ChatroomPreview";



type Props = {
  chatrooms: TChatroom[];
  setIsSidebarOpen: SetState<boolean>;
};

const ChatroomList = ({ chatrooms, setIsSidebarOpen }: Props) => {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <ul
      className="scrollbar-hide  
      h-[80vh] max-h-[63vh] 
      overflow-y-scroll font-medium  md:max-h-[80vh]"
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
