import type { Chatroom, User, Message } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

type Props = {
  room: Chatroom & { messages: Message[]; users: User[] };
};

const ChatroomPreview = ({ room }: Props) => {
  const { data: session } = useSession();
  if (!session) return null;
  const geust = room.users.find((user) => user.id !== session.user.id);
  if (!geust) return null;
  return (
    <div className="flex h-20 items-center px-4 hover:bg-black ">
      <Image
        src={geust.image}
        alt="user"
        width={40}
        height={40}
        className="rounded-full "
      />
      <div className="flex w-full flex-col gap-2 pl-4">
        <div className="flex justify-between">
          <h3 className="font-semibold text-white">{room.id}</h3>
          <span className="text-sm text-gray-400">12:00</span>
        </div>
        <span className="h-6 overflow-hidden text-ellipsis text-gray-500">
          That is so awesome !
        </span>
      </div>
    </div>
  );
};

export default ChatroomPreview;
