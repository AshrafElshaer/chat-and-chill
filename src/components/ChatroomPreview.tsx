import Image from "next/image";
import React from "react";

// type Props = {}

const ChatroomPreview = () => {
  if (!ChatRoom) return null;
  return (
    <div className="flex h-20 items-center bg-black px-4 ">
      <Image
        src={ChatRoom[0].users[0].image}
        alt="user"
        width={40}
        height={40}
        className="rounded-full "
      />
      <div className="flex w-full flex-col pl-4 gap-2">
        <div className="flex justify-between">
          <h3 className="font-semibold text-white">
            {ChatRoom[0].users[0].name}
          </h3>
          <span className="text-sm text-gray-400">12:00</span>
        </div>
        <span className="text-gray-500">{ChatRoom[0]?.messages.at(-1)?.content}</span>
      </div>
    </div>
  );
};

export default ChatroomPreview;

const ChatRoom = [
  {
    id: 1,
    messages: [
      {
        id: 1,
        content: "Hello everyone!",
        senderId: 1,
        createdAt: "2023-05-08T12:34:56Z",
        chatRoomId: 1,
      },
      {
        id: 2,
        content: "Hi there!",
        senderId: 2,
        createdAt: "2023-05-08T12:35:22Z",
        chatRoomId: 1,
      },
      {
        id: 3,
        content: "How's everyone doing?",
        senderId: 3,
        createdAt: "2023-05-08T12:36:10Z",
        chatRoomId: 1,
      },
    ],
    users: [
      {
        id: 1,
        name: "Alice",
        email: "alice@example.com",
        image:
          "https://nrsstdptogyfvsluloir.supabase.co/storage/v1/object/public/images/images/user-icon.png",
      },
      {
        id: 2,
        name: "Bob",
        email: "bob@example.com",
        image:
          "https://nrsstdptogyfvsluloir.supabase.co/storage/v1/object/public/images/images/user-icon.png",
      },
      {
        id: 3,
        name: "Charlie",
        email: "charlie@example.com",
        image:
          "https://nrsstdptogyfvsluloir.supabase.co/storage/v1/object/public/images/images/user-icon.png",
      },
    ],
  },
];
