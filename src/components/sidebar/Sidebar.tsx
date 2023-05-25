import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { pusherClientSide } from "@/utils/pusherClientSide";
import { useUserPresence } from "@/hooks/useUserPresence";

import { type ChangeEvent, useState, useEffect } from "react";

import { CloseSidebar, OpenSidebar, Tabs } from "./controllers";
import { ChatroomList } from "./chatrooms";
import { FriendsList } from "./friends";
import Button from "../Button";

type Props = {
  children: React.ReactNode;
};

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

const Sidebar = ({ children }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<"chatrooms" | "friends">(
    "friends"
  );
  const connectToPusher = useUserPresence();

  const { data: session } = useSession();
  const {
    data: chatroomsResponse,
    error: chatroomsError,
    refetch,
  } = api.chatroom.getUserChatrooms.useQuery();

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
        }  h-full overflow-hidden bg-lightBg   transition-transform  md:translate-x-0`}
        aria-label="Sidebar"
      >
        <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

        <nav className="relative">
          <ChatroomList
            chatrooms={chatroomsResponse.chatrooms}
            setIsSidebarOpen={setIsSidebarOpen}
            selectedTab={selectedTab}
          />
          <FriendsList
            selectedTab={selectedTab}
            isSidebarOpen={isSidebarOpen}
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
