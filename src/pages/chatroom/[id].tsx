"use client";
import { type ChangeEvent, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { pusherClientSide } from "@/utils/pusherClientSide";
import { useUserPresence } from "@/hooks";
import EmojiPicker from "emoji-picker-react";
import { Theme, type EmojiClickData, EmojiStyle } from "emoji-picker-react";

import type { Message, User } from "@prisma/client";

import {
  LoadingSpinner,
  Conversation,
  Input,
  Icon,
  Avatar,
} from "@/components";
import Head from "next/head";
import Uploader from "@/components/Uploader";

export interface FileState extends File {
  preview: string;
}

const Chatroom = () => {
  const router = useRouter();
  const { isUserOnline } = useUserPresence();
  const { data: session } = useSession();
  const { id: roomId } = router.query;
  const [newMessage, setNewMessage] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<FileState[]>([]);

  const chatroomQuery = api.chatroom.getChatroomById.useQuery(
    {
      id: Number(roomId),
    },
    {
      enabled: Boolean(roomId) && Boolean(session),
    }
  );

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
  function handleEmojiClick(emojiObject: EmojiClickData, e: MouseEvent) {
    setNewMessage((curr) => curr + emojiObject.emoji);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newMessage) return;
    setIsEmojiPickerOpen(false);
    await sendNewMessage({
      text: newMessage,
      chatroomId: Number(roomId),
    });
    setNewMessage("");
  }

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
        <div className="mt-[3.75rem] flex h-[3.75rem] w-full items-center justify-start gap-4  bg-lightBg px-4 ">
          <Avatar src={guest.image} isOnline={isGeustOnline} />
          <span className="text-base text-primary">{guest.name}</span>
        </div>

        {/* Conversation */}
        <div className=" p-4">
          <Conversation messages={messages} userId={session.user.id} />
        </div>
        {/* Emoji Picker */}
        {isEmojiPickerOpen && (
          <div className="absolute bottom-32 left-6 md:bottom-16 md:left-[22rem] ">
            <EmojiPicker
              theme={Theme.DARK}
              onEmojiClick={handleEmojiClick}
              emojiStyle={EmojiStyle.APPLE}
            />
          </div>
        )}

        {/* Text Input */}
        <div className="relative">
          {isUploaderOpen && (
            <div className={`absolute bottom-20 left-1/2  ${uploadedFiles.length ? "h-auto" : "h-56"}  w-4/5  -translate-x-1/2 `}>
              <Uploader
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
              />
            </div>
          )}

          <form
            className=" relative flex items-center justify-between gap-4 p-4"
            onSubmit={(e) => void handleSubmit(e)}
          >
            <button
              className="absolute  left-6 z-20"
              type="button"
              onClick={() => setIsEmojiPickerOpen((prev) => !prev)}
            >
              <Icon iconName="emoji" />
            </button>
            <Input
              placeholder="Type a message"
              className="w-full rounded-full pl-12 "
              value={newMessage}
              onChange={handleInputChange}
            />
            <button
              className={`absolute right-6 z-20 ${uploadedFiles.length > 0 ? "text-green-500" : "text-darkGrey"}`}
              type="button"
              onClick={() => setIsUploaderOpen((prev) => !prev)}
            >
              {uploadedFiles.length > 0 ? (
                <span className="text-sm absolute grid place-content-center -top-8  w-6 h-6 bg-green-950 text-white  rounded-full">{uploadedFiles.length}</span>
              ) : ""}
              <Icon iconName="attachment"  />
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Chatroom;
