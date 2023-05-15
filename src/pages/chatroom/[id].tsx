"use client";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";

import {
  LoadingSpinner,
  Conversation,
  Input,
  Button,
  Icon,
} from "@/components";
import { type ChangeEvent, useState } from "react";

const Chatroom = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { id: roomId } = router.query;
  const [newMessage, setNewMessage] = useState("");

  const { data: chatroomData, refetch } = api.chatroom.getChatroomById.useQuery(
    {
      id: Number(roomId),
    }
  );

  const { mutateAsync: sendNewMessage } =
    api.messages.sendNewMessage.useMutation();

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setNewMessage(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const response = await sendNewMessage({
      text: newMessage,
      chatroomId: Number(roomId),
    });

    if (response.id) {
      // TODO: remove refetch and use real time update
      await refetch();
    }
    // api.message.createMessage.mutate({ text: newMessage, roomId: Number(roomId) });
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
      <div className="flex-grow p-4">
        <Conversation
          messages={chatroomData.messages}
          userId={session.user.id}
        />
      </div>
      <div>
        <form
          className=" relative flex items-center justify-between gap-4 p-4"
          onSubmit={(e) => void handleSubmit(e)}
        >
          <button className="absolute  left-6 z-20">
            <Icon iconName="emoji" />
          </button>
          <Input
            placeholder="Type a message"
            className="w-full rounded-full pl-12 "
            value={newMessage}
            onChange={handleInputChange}
          />
          <button className="absolute right-6 z-20 fill-current">
            <Icon iconName="attachment" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatroom;
