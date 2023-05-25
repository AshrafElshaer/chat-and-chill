"use client";
import { type ChangeEvent, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { pusherClientSide } from "@/utils/pusherClientSide";
import { useUserPresence } from "@/hooks/useUserPresence";

import type { Message, User } from "@prisma/client";

import {
  LoadingSpinner,
  Conversation,
  Input,
  Icon,
  Avatar,
} from "@/components";
import Head from "next/head";

const Chatroom = () => {
  const router = useRouter();
  const { isUserOnline } = useUserPresence();
  const { data: session } = useSession();
  const { id: roomId } = router.query;
  const [newMessage, setNewMessage] = useState("");

  const chatroomQuery =
    api.chatroom.getChatroomById.useQuery({
      id: Number(roomId),
    },{
      enabled: Boolean(roomId),
    });
    
  const [messages, setMessages] = useState(chatroomQuery.data?.messages || []);

  const { mutateAsync: sendNewMessage } =
    api.messages.sendNewMessage.useMutation();

  const handlePusherEvent = useCallback(
    (data: { message: Message & { user: User } }) => {
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

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setNewMessage(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await sendNewMessage({
      text: newMessage,
      chatroomId: Number(roomId),
    });
    setNewMessage("");
  }

  if (!chatroomQuery.data && !chatroomQuery.error) return <LoadingSpinner />;

  if(chatroomQuery.error) return <div>{chatroomQuery.error.message}</div>

  if (!session) return <LoadingSpinner />;

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

      <section className="flex h-screen flex-col justify-start text-primary">
        <div className="mt-[3.75rem] flex h-[3.75rem] w-full items-center justify-start gap-4  bg-lightBg px-4 md:mt-0">
          <Avatar src={guest.image} isOnline={isGeustOnline} />
          <span className="text-base text-primary">{guest.name}</span>
        </div>
        <div className=" p-4">
          <Conversation messages={messages} userId={session.user.id} />
        </div>

        <form
          className=" relative flex items-center justify-between gap-4 p-4"
          onSubmit={(e) => void handleSubmit(e)}
        >
          <button className="absolute  left-6 z-20" type="button">
            <Icon iconName="emoji" />
          </button>
          <Input
            placeholder="Type a message"
            className="w-full rounded-full pl-12 "
            value={newMessage}
            onChange={handleInputChange}
          />
          <button className="absolute right-6 z-20 fill-current" type="button">
            <Icon iconName="attachment" />
          </button>
        </form>
      </section>
    </>
  );
};

export default Chatroom;
