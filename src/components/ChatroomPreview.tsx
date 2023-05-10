import type { Chatroom, Message, FriendRequest } from "../../prisma/types";
import Image from "next/image";
import React from "react";

type Props = {
  chatroom: Chatroom;
};

const ChatroomPreview = ({ chatroom }: Props) => {
  if (!chatroom) return <div>no chatroom</div>;

  const user = chatroom.users[0];
  const lastMessage = chatroom.messages.at(-2)?.text || "No messages yet" ;


  return (
    <div className="flex h-20 items-center hover:bg-black px-4 ">
      <Image
        src={user.image}
        alt="user"
        width={40}
        height={40}
        className="rounded-full "
      />
      <div className="flex w-full flex-col gap-2 pl-4">
        <div className="flex justify-between">
          <h3 className="font-semibold text-white">{user.name}</h3>
          <span className="text-sm text-gray-400">12:00</span>
        </div>
        <span className="text-gray-500 text-ellipsis overflow-hidden h-6">{lastMessage}</span>
      </div>
    </div>
  );
};

export default ChatroomPreview;
