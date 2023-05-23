// type Props = {}

import { type ChangeEvent, useState, useEffect } from "react";
import Input from "../Input";
import Button from "../Button";
import { signOut, useSession } from "next-auth/react";
import OpenSidebar from "./OpenSidebar";
import CloseSidebar from "./CloseSidebar";
import ChatroomList from "./ChatroomList";
import Image from "next/image";
import { api } from "@/utils/api";
import Icon from "../Icon";
import { pusherClientSide } from "@/utils/pusherClientSide";
import type { PresenceChannel } from "pusher-js";
type Props = {
  children: React.ReactNode;
};

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

const Sidebar = ({ children }: Props) => {
  const channel = pusherClientSide.subscribe(
    "presence-users-channel"
  ) as PresenceChannel;

  useEffect(() => {
    return () => {
      pusherClientSide.unsubscribe("presence-user-channel");
    };
  }, [channel]);

  const { data: session } = useSession();
  const {
    data: chatroomsResponse,
    error: chatroomsError,
    refetch,
  } = api.chatroom.getUserChatrooms.useQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleRefetch = async () => {
    await refetch();
  };

  useEffect(() => {
    pusherClientSide.subscribe("chatrooms");
    pusherClientSide.bind("latest-message", handleRefetch);

    return () => {
      pusherClientSide.unsubscribe("chatrooms");
      pusherClientSide.unbind("latest-message", handleRefetch);
    };
  }, []);

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }
  if (chatroomsError) return <div>{chatroomsError.message}</div>;
  if (!chatroomsResponse) return <div>Loading...</div>;
  return (
    <>
      <div className="fixed left-0 top-0 flex h-[3.75rem] w-full items-center justify-between bg-lightBg px-4 md:hidden  md:justify-start">
        {isSidebarOpen ? (
          <CloseSidebar setIsSidebarOpen={setIsSidebarOpen} />
        ) : (
          <OpenSidebar setIsSidebarOpen={setIsSidebarOpen} />
        )}
        {session ? (
          <Image
            src={session.user.image}
            width={35}
            height={35}
            alt="Profile Image"
            className="rounded-full"
          />
        ) : null}
      </div>

      <aside
        id="default-sidebar"
        className={`fixed left-0 top-14 z-40 h-screen w-80 md:top-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }  h-full bg-lightBg transition-transform   md:translate-x-0 `}
        aria-label="Sidebar"
      >
        <div className="relative my-4 px-2">
          <Icon iconName="search" className="absolute left-4 top-2 z-10" />
          <Input
            placeholder="Search or start new chat"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full rounded-full bg-darkBg pl-12 text-primary"
          />
        </div>

        <nav>
          <ChatroomList
            chatrooms={chatroomsResponse.chatrooms}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </nav>
        <div className="px-2">
          <Button
            buttonType="secondary"
            icon="signout"
            onClick={() =>
              void signOut({
                callbackUrl: "/auth/login",
                redirect: true,
              })
            }
          >
            Sign Out
          </Button>
        </div>
      </aside>

      <section className={`min-h-[90vh] md:ml-80 md:min-h-screen`}>
        {children}
      </section>
    </>
  );
};

export default Sidebar;
