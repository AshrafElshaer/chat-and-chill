import React, { useCallback, useEffect, useState } from "react";

import { useSidebars, useUserPresence } from "@/hooks";

import { pusherClientSide } from "@/utils/pusherClientSide";

import type { Session } from "next-auth";
import type { Chatroom, File, Message, User } from "@prisma/client";

import {
  ChatroomInputsContainer,
  InfoSidebar,
  Conversation,
  ChatroomHeader,
} from "@/components";

type Props = {
  guest: User;
  session: Session;
  roomId: number;
  chatroom: Chatroom & {
    messages: (Message & { user: User; files: File[] })[];
    users: User[];
  };
};

const ChatroomContainer = ({ guest, session, roomId, chatroom }: Props) => {
  const { isUserOnline } = useUserPresence();
  const { isInfoSidebarOpen, toggleInfoSidebar } = useSidebars();

  const [messages, setMessages] = useState(chatroom.messages || []);

  useEffect(() => {
    chatroom && setMessages(chatroom.messages);
  }, [chatroom]);

  const handlePusherEvent = useCallback(
    (data: { message: Message & { user: User; files: File[] } }) => {
      const isMessageExist = messages.find((m) => m.id === data.message.id);
      if (isMessageExist) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [messages]
  );

  useEffect(() => {
    const channel = pusherClientSide.subscribe(`chatroom-${roomId.toString()}`);
    channel.bind(`new-message`, handlePusherEvent);

    return () => {
      channel.unsubscribe();
      channel.unbind(`new-message`, handlePusherEvent);
    };
  }, [roomId, handlePusherEvent]);

  const chatroomFiles = chatroom.messages
    .map((message) => message.files)
    .flat();

  return (
    <>
      <div className="flex flex-grow flex-col justify-start">
        <ChatroomHeader
          guest={guest}
          isGeustOnline={isUserOnline(guest.id)}
          toggleInfoSidebar={toggleInfoSidebar}
        />
        <Conversation messages={messages} userId={session.user.id} />
        <ChatroomInputsContainer roomId={roomId} />
      </div>
      <InfoSidebar
        guest={guest}
        files={chatroomFiles}
        isInfoSidebarOpen={isInfoSidebarOpen}
        toggleInfoSidebar={toggleInfoSidebar}
      />
    </>
  );
};

export default ChatroomContainer;
