import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { getDaysAgo } from "@/components/Message";
import { pusherClientSide } from "@/utils/pusherClientSide";

import type { Chatroom, User, Message } from "@prisma/client";
import type { Session } from "next-auth";
import type { PresenceChannel } from "pusher-js";
import { useUserPresence } from "@/hooks/useUserPresence";
import LoadingSpinner from "../LoadingSpinner";
import Avatar from "../Avatar";

type Props = {
  room: Chatroom & { messages: Message[]; users: User[] };
  session: Session;
};

const ChatroomPreview = ({ room, session }: Props) => {
  const router = useRouter();
  const { id: paramId } = router.query;
  const { connectedUsers ,isUserOnline} = useUserPresence();

  if (!room) return <LoadingSpinner />;

  const geust = room.users.find((user) => user.id !== session.user.id);
  if (!geust) return null;
  const isGeustOnline = isUserOnline(geust.id);

  const lastMessage = room.messages.at(-1);
  return (
    <div
      className={`flex h-20 items-center px-4 hover:bg-black ${
        room.id === Number(paramId) ? "bg-black" : ""
      }`}
    >
      <Avatar src={geust.image} isOnline={isGeustOnline} />

      <div className="flex w-full flex-col gap-2 pl-4">
        <div className="flex justify-between">
          <h3 className="font-semibold text-white">{geust.name}</h3>
          <span className="text-sm text-gray-400">
            {lastMessage
              ? getDaysAgo(new Date(lastMessage.createdAt)) > 1
                ? `${getDaysAgo(new Date(lastMessage.createdAt))} days ago`
                : new Date(lastMessage.createdAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
              : "No messages yet"}
          </span>
        </div>
        <span className="h-6 overflow-hidden text-ellipsis text-gray-500">
          {lastMessage
            ? lastMessage.userId === session.user.id
              ? `You: ${lastMessage.text} `
              : lastMessage.text
            : "Start a conversation"}
        </span>
      </div>
    </div>
  );
};

export default ChatroomPreview;
