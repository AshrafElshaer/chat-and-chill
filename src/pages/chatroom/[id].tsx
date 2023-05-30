"use client";
import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { pusherClientSide } from "@/utils/pusherClientSide";
import { useUserPresence } from "@/hooks";

import type { File as FileSchema, Message, User } from "@prisma/client";

import {
  LoadingSpinner,
  Conversation,
  ChatroomHeader,
  ChatroomInputsContainer,
} from "@/components";

const Chatroom = () => {
  const router = useRouter();
  const { isUserOnline } = useUserPresence();
  const { data: session } = useSession();
  const { id: roomId } = router.query;

  const chatroomQuery = api.chatroom.getChatroomById.useQuery(
    {
      id: Number(roomId),
    },
    {
      enabled: Boolean(roomId) && Boolean(session),
    }
  );

  const [messages, setMessages] = useState(chatroomQuery.data?.messages || []);

  const handlePusherEvent = useCallback(
    (data: { message: Message & { user: User; files: FileSchema[] } }) => {
      const isMessageExist = messages.find((m) => m.id === data.message.id);
      if (isMessageExist) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [messages]
  );

  useEffect(() => {
    chatroomQuery.data && setMessages(chatroomQuery.data.messages);
  }, [chatroomQuery.data]);

  useEffect(() => {
    const channel = pusherClientSide.subscribe(`chatroom-${roomId as string}`);
    channel.bind(`new-message`, handlePusherEvent);

    return () => {
      channel.unsubscribe();
      channel.unbind(`new-message`, handlePusherEvent);
    };
  }, [roomId, handlePusherEvent]);

  if (!chatroomQuery.data && !chatroomQuery.error) return <LoadingSpinner />;
  if (!session) return <LoadingSpinner />;
  if (chatroomQuery.error) return <div>{chatroomQuery.error.message}</div>;

  const user = session?.user;
  const guest = chatroomQuery.data?.users.find((u) => u.id !== user?.id);
  if (!guest) return <LoadingSpinner />;

  return (
    <>
      <Head>
        <title>{guest.name}</title>
        <meta name="description" content="Chatroom" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex h-5/6 flex-col justify-start text-primary ">
        <ChatroomHeader guest={guest} isGeustOnline={isUserOnline(guest.id)} />
        <Conversation messages={messages} userId={session.user.id} />
        <ChatroomInputsContainer roomId={Number(roomId)} />
      </section>
    </>
  );
};

export default Chatroom;
