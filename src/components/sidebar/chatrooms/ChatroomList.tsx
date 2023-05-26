import { useSession } from "next-auth/react";
import { type ChangeEvent, useEffect, useState } from "react";

import { type SetState } from "../Sidebar";
import type { Chatroom, Message, User } from "@prisma/client";

import Link from "next/link";
import ChatroomPreview from "./ChatroomPreview";
import SearchBar from "../SearchBar";
import { api } from "@/utils/api";
import { pusherClientSide } from "@/utils/pusherClientSide";
import LoadingSpinner from "@/components/LoadingSpinner";

type Props = {
  setIsSidebarOpen: SetState<boolean>;
  selectedTab: "chatrooms" | "friends";
};

const ChatroomList = ({ setIsSidebarOpen, selectedTab }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data: session } = useSession();

  const {
    data: chatroomsResponse,
    error: chatroomsError,
    isSuccess,
    refetch,
  } = api.chatroom.getUserChatrooms.useQuery();

  const [chatrooms, setChatrooms] = useState<
    (Chatroom & { messages: Message[]; users: User[] })[]
  >(chatroomsResponse?.chatrooms ?? []);

  const handleRefetch = async () => {
    await refetch();
  };

  useEffect(() => {
    setChatrooms(chatroomsResponse?.chatrooms ?? []);
  }, [isSuccess, chatroomsResponse]);

  useEffect(() => {
    const channel = pusherClientSide.subscribe("chatrooms");
    channel.bind("latest-message", handleRefetch);

    return () => {
      channel.unsubscribe();
      channel.unbind("latest-message", handleRefetch);
    };
  }, []);

  if (!chatroomsResponse) return <LoadingSpinner />;

  if (chatroomsError) return <div>{chatroomsError.message}</div>;

  if (!session) return <div>Not Authenticated</div>;

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchTerm(value);

    if (!chatroomsResponse) return;
    if (!session) return;
    if (!value.trim()) return setChatrooms(chatroomsResponse.chatrooms);

    const filteredChatrooms = chatroomsResponse.chatrooms.filter((room) => {
      const guest = room.users.find((user) => user.id !== session.user.id);
      if (
        guest &&
        guest.name &&
        guest.name.toLowerCase().includes(value.trim().toLowerCase())
      )
        return true;
    });

    setChatrooms(filteredChatrooms);
  }

  return (
    <ul
      className={`scrollbar-hide  
     h-full
       w-full 
      transform overflow-y-scroll  font-medium
      
      transition-transform duration-300 md:h-[80vh]
      ${selectedTab === "friends" ? "-translate-x-full" : ""}`}
    >
      <li>
        <SearchBar
          placeholder="Search Chat's"
          handleSearchChange={handleSearchChange}
          searchTerm={searchTerm}
        />
      </li>
      {chatrooms.map((chatroom) => (
        <li key={chatroom.id}>
          <Link
            href={`/chatroom/${chatroom.id}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <ChatroomPreview room={chatroom} session={session} />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ChatroomList;
