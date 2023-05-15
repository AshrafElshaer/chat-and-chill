import { type Message, type User } from "@prisma/client";
import Image from "next/image";
import React from "react";

type Props = {
  message: Message & { user: User };
  userId: number;
};

const MessageComponent = ({ message, userId }: Props) => {
  return (
    <div
      className={`w-fit max-w-prose ${
        message.userId === userId ? "ml-auto" : ""
      }`}
    >
      <div
        className={`mb-1  mt-4 rounded-md   p-4 ${
          message.userId === userId ? "bg-blue" : "bg-lightBg"
        }`}
      >
        <span>{message.text}</span>
      </div>
      <span className="text-xs text-gray-500">
        {new Date(message.createdAt).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
};

export default MessageComponent;
