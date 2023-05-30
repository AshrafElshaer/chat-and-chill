import type { File, Message, User } from "@prisma/client";
import React, { useEffect } from "react";
import MessageComponent from "./Message";

type Props = {
  messages: (Message & { user: User; files: File[] })[];
  userId: number;
};

const Conversation = ({ messages, userId }: Props) => {
  const conversationRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    conversationRef.current?.scrollTo(0, conversationRef.current?.scrollHeight);
  }, [messages]);

  return (
    <section
      className="scrollbar-hide h-[60vh] overflow-y-scroll scroll-smooth p-4  md:h-[73vh]"
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
    </section>
  );
};

export default Conversation;
