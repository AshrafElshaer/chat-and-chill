import type { Message, User } from "@prisma/client";
import React from "react";
import MessageComponent from "./Message";

type Props = {
  messages: (Message & { user: User })[];
  userId: number;
};

const Conversation = ({ messages, userId }: Props) => {
  console.log(messages);
  return (
    <div className="scrollbar-hide h-full overflow-y-scroll">
      {!messages.length ? (
        <div className="flex h-full items-center justify-center">
          <span className="text-2xl text-primary">No messages yet</span>
        </div>
      ) : (
        messages.map((message) => {
          return (
            <MessageComponent
              key={message.id}
              message={message}
              userId={userId}
            />
          );
        })
      )}
    </div>
  );
};

export default Conversation;
