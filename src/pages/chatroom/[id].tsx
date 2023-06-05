"use client";
import Head from "next/head";
import { useState } from "react";
import { useSession } from "next-auth/react";

import { api } from "@/utils/api";
import { useRouter } from "next/router";

import { useSidebars, useUserPresence } from "@/hooks";

import {
  LoadingSpinner,
  ChatroomContainer,
  ChatroomHeader,
} from "@/components";
import { VoiceCall } from "@/components/voiceCall";

const Chatroom = () => {
  const [isVoiceCall, setIsVoiceCall] = useState(false);
  const router = useRouter();
  const { isUserOnline } = useUserPresence();
  const { isInfoSidebarOpen, toggleInfoSidebar } = useSidebars();

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

      <section className="relative flex h-5/6 flex-col justify-start overflow-hidden text-primary">
        {isVoiceCall ? (
          <VoiceCall setIsVoiceCall={setIsVoiceCall} roomId={Number(roomId)} user={user}/>
        ) : (
          <ChatroomContainer
            setIsVoiceCall={setIsVoiceCall}
            chatroom={chatroom}
            guest={guest}
            session={session}
            roomId={Number(roomId)}
          />
        )}
      </section>
    </>
  );
};

export default Chatroom;
