import type { Chatroom, User, Message } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

import { getDaysAgo } from "@/components/Message";

type Props = {
  room: Chatroom & { messages: Message[]; users: User[] };
};

const ChatroomPreview = ({ room }: Props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { id: paramId } = router.query;

  if (!room) return null;
  if (!session) return null;
  const geust = room.users.find((user) => user.id !== session.user.id);
  if (!geust) return null;

  const lastMessage = room.messages.at(-1);
  // if (!lastMessage) return null;
  // const lastMessageDate =  new Date(lastMessage.createdAt);
  return (
    <div
      className={`flex h-20 items-center px-4 hover:bg-black ${
        room.id === Number(paramId) ? "bg-black" : ""
      }`}
    >
      <Image
        src={geust.image}
        alt="user"
        width={40}
        height={40}
        className="rounded-full "
      />
      <div className="flex w-full flex-col gap-2 pl-4">
        <div className="flex justify-between">
          <h3 className="font-semibold text-white">{geust.name}</h3>
          <span className="text-sm text-gray-400">
          { lastMessage ?
          getDaysAgo(new Date(lastMessage.createdAt)) > 1
          ? `${getDaysAgo(new Date(lastMessage.createdAt))} days ago`
          : new Date(lastMessage.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }) : "No messages yet"}
          </span>
        </div>
        <span className="h-6 overflow-hidden text-ellipsis text-gray-500">
          That is so awesome !
        </span>
      </div>
    </div>
  );
};

export default ChatroomPreview;
