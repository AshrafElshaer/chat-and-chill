import React, { useCallback, useEffect, useState } from "react";

import { useSidebars, useUserPresence } from "@/hooks";
import { api } from "@/utils/api";
import { pusherClientSide } from "@/utils/pusherClientSide";

import type { Session } from "next-auth";
import type { File as FileSchema, Message, User } from "@prisma/client";

import {
  ChatroomInputsContainer,
  LoadingSpinner,
  InfoSidebar,
  Conversation,
  ChatroomHeader,
} from "@/components";

type Props = {
  guest: User;
  session: Session;
  roomId: number;
};

const ChatroomContainer = ({ guest, session, roomId }: Props) => {
  const { isUserOnline } = useUserPresence();
  const { isInfoSidebarOpen, toggleInfoSidebar } = useSidebars();
  const chatroomQuery = api.chatroom.getChatroomById.useQuery(
    {
      id: Number(roomId),
    },
    {
      enabled: Boolean(roomId) && Boolean(session),
    }
  );

  const [messages, setMessages] = useState(chatroomQuery.data?.messages || []);

  useEffect(() => {
    chatroomQuery.data && setMessages(chatroomQuery.data.messages);
  }, [chatroomQuery.data]);

  const handlePusherEvent = useCallback(
    (data: { message: Message & { user: User; files: FileSchema[] } }) => {
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

  if (!chatroomQuery.data && !chatroomQuery.error) return <LoadingSpinner />;
  if (!session) return <LoadingSpinner />;
  if (chatroomQuery.error) return <div>{chatroomQuery.error.message}</div>;

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
        files={chatroomQuery.data.files}
        isInfoSidebarOpen={isInfoSidebarOpen}
        toggleInfoSidebar={toggleInfoSidebar}
      />
    </>
  );
};

export default ChatroomContainer;
