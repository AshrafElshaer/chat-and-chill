import type { Message, User } from "@prisma/client";
import React, { useEffect } from "react";
import MessageComponent from "./Message";

type Props = {
  messages: (Message & { user: User })[];
  userId: number;
};

const Conversation = ({ messages, userId }: Props) => {
  const conversationRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationRef.current?.scrollTo(0, conversationRef.current?.scrollHeight);
  }, [messages]);

  return (
    <div
      className="scrollbar-hide max-h-[60vh] overflow-y-scroll scroll-smooth md:max-h-[77vh]"
      ref={conversationRef}
    >
      {!messages.length ? (
        <div className="flex h-full items-center justify-center">
          <span className="text-2xl text-primary">No messages yet!</span>
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
