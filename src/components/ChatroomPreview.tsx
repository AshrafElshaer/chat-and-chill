import type { Chatroom, Message, FriendRequest } from "../../prisma/types";
import Image from "next/image";
import React from "react";

// type Props = {
//   chatroom: Chatroom;
// };

const ChatroomPreview = () => {
  return (
    <div className="flex h-20 items-center px-4 hover:bg-black ">
      <Image
        src={
          "https://nrsstdptogyfvsluloir.supabase.co/storage/v1/object/public/images/images/user-icon.png"
        }
        alt="user"
        width={40}
        height={40}
        className="rounded-full "
      />
      <div className="flex w-full flex-col gap-2 pl-4">
        <div className="flex justify-between">
          <h3 className="font-semibold text-white">User 1</h3>
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
