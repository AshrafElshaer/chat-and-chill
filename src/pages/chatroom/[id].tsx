"use client";
import {
  useState,
  useEffect,
  useCallback,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useSession } from "next-auth/react";

import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { pusherClientSide } from "@/utils/pusherClientSide";
import { useUserPresence } from "@/hooks";
import EmojiPicker from "emoji-picker-react";
import { Theme, type EmojiClickData, EmojiStyle } from "emoji-picker-react";

import type { File as FileSchema, Message, User } from "@prisma/client";

import {
  LoadingSpinner,
  Conversation,
  Input,
  Icon,
  Avatar,
  ChatroomInputsContainer,
} from "@/components";
import Head from "next/head";
import Uploader from "@/components/Uploader";
import { uploadFileToStorage } from "@/utils/supabase";
import { toast } from "react-toastify";

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
  const isGeustOnline = isUserOnline(guest.id);

  return (
    <>
      <Head>
        <title>{guest.name}</title>
        <meta name="description" content="Chatroom" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex h-5/6 flex-col justify-start text-primary">
        {/* Header */}
        <div className="mt-[3.75rem] flex h-[3.75rem] w-full items-center justify-between gap-4  bg-lightBg px-4">
          <div className="flex items-center gap-4">
            <Avatar src={guest.image} isOnline={isGeustOnline} />
            <span className="text-base text-primary">{guest.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="rounded-full bg-black p-2">
              <Icon iconName="video" size="1.2rem" />
            </button>
            <button className="rounded-full bg-black p-2">
              <Icon iconName="phone" size="1.2rem" />
            </button>
            <button className="rounded-full bg-black p-2">
              <Icon iconName="dots" size="1.2rem" />
            </button>
          </div>
        </div>



        <Conversation messages={messages} userId={session.user.id} />
        <ChatroomInputsContainer roomId={Number(roomId)} />
      </section>
    </>
  );
};

export default Chatroom;
