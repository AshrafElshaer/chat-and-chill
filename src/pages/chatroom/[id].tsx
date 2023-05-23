"use client";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";

import { LoadingSpinner, Conversation, Input, Icon } from "@/components";
import { type ChangeEvent, useState, useEffect } from "react";
import { pusherClientSide } from "@/utils/pusherClientSide";
import type { Message, User } from "@prisma/client";

const Chatroom = () => {
  const router = useRouter();

  const { data: session } = useSession();
  const { id: roomId } = router.query;
  const [newMessage, setNewMessage] = useState("");

  const { data: chatroomData } = api.chatroom.getChatroomById.useQuery({
    id: Number(roomId),
  });
  const [messages, setMessages] = useState(chatroomData?.messages || []);

  const { mutateAsync: sendNewMessage } =
    api.messages.sendNewMessage.useMutation();

  useEffect(() => {
    chatroomData && setMessages(chatroomData.messages);
  }, [chatroomData]);

  useEffect(() => {
    pusherClientSide.subscribe(`chatroom-${roomId as string}`);
    pusherClientSide.bind(`new-message`, handlePusherEvent);

    return () => {
      pusherClientSide.unsubscribe(`chatroom-${roomId as string}`);
      pusherClientSide.unbind(`new-message`, handlePusherEvent);
    };
  }, [roomId]);

  function handlePusherEvent(data: { message: Message & { user: User } }) {
    const isMessageExist = messages.find((m) => m.id === data.message.id);
    if (isMessageExist) return;

    setMessages((prev) => [...prev, data.message]);
  }

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

  if (!chatroomData) return <LoadingSpinner />;
  if (!session) return <LoadingSpinner />;
  const user = session?.user;
  const guest = chatroomData?.users.find((u) => u.id !== user?.id);

  if (!guest) return <LoadingSpinner />;

  return (
    <div className="flex h-screen flex-col justify-start text-primary">
      <div className="mt-[3.75rem] flex h-[3.75rem] w-full items-center justify-start gap-4  bg-lightBg px-4 md:mt-0">
        <Image
          src={guest.image}
          width={35}
          height={35}
          alt="Profile Image"
          className="rounded-full"
        />
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
    </div>
  );
};

export default Chatroom;
