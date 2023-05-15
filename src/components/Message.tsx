import { type Message, type User } from "@prisma/client";
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
        className={`mb-1  mt-4 rounded-md px-4 py-2 leading-relaxed ${
          message.userId === userId ? "bg-blue" : "bg-lightBg"
        }`}
      >
        <span>{message.text}</span>
    
      </div>
      <span className="text-xs text-gray-500">
        {getDaysAgo(new Date(message.createdAt)) > 1
          ? `${getDaysAgo(new Date(message.createdAt))} days ago`
          : new Date(message.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
      </span>
    </div>
  );
};

export default MessageComponent;



const getDaysAgo = (date: Date) => {
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
