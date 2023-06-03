"use client";
import Head from "next/head";
import { useState } from "react";
import { useSession } from "next-auth/react";

import { api } from "@/utils/api";
import { useRouter } from "next/router";

import { useUserPresence } from "@/hooks";

import { LoadingSpinner, ChatroomContainer } from "@/components";

const Chatroom = () => {
  const router = useRouter();
  const { isUserOnline } = useUserPresence();
  const { data: session } = useSession();
  const { id: roomId } = router.query;

  const {
    data: chatroom,
    error,
    isLoading,
  } = api.chatroom.getChatroomById.useQuery(
    {
      id: Number(roomId),
    },
    {
      enabled: Boolean(roomId) && Boolean(session),
    }
  );

  if (!chatroom && !error && isLoading) return <LoadingSpinner />;
  if (!session) return router.push("/auth/signin");

  if (error) return <div>{error.message}</div>;

  const user = session?.user;
  const guest = chatroom?.users.find((u) => u.id !== user?.id);
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
          chatroom={chatroom}
          guest={guest}
          session={session}
          roomId={Number(roomId)}
        />
      </section>
    </>
  );
};

export default Chatroom;
