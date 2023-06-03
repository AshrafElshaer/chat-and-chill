"use client";
import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { pusherClientSide } from "@/utils/pusherClientSide";
import { useSidebars, useUserPresence } from "@/hooks";

import type { File as FileSchema, Message, User } from "@prisma/client";

import {
  LoadingSpinner,
  Conversation,
  ChatroomHeader,
  ChatroomInputsContainer,
  InfoSidebar,
  ChatroomContainer,
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

      <section className="relative flex  h-5/6 justify-start overflow-hidden text-primary">
        <ChatroomContainer
          guest={guest}
          session={session}
          roomId={Number(roomId)}
        />
      </section>
    </>
  );
};

export default Chatroom;
