import { useState} from "react";
import Image from "next/image";

import { useSession } from "next-auth/react";
import { useUserPresence } from "@/hooks/useUserPresence";

import { CloseSidebar, OpenSidebar, Tabs } from "./controllers";
import { ChatroomList } from "./chatrooms";
import { Friends } from "./friends";

type Props = {
  children: React.ReactNode;
};

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

const Sidebar = ({ children }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<"chatrooms" | "friends">(
    "chatrooms"
  );
  const connectToPusher = useUserPresence();

  const { data: session } = useSession();

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
        className={`fixed left-0 top-14 z-40 h-screen w-80  md:top-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }  h-full overflow-hidden bg-lightBg   transition-transform  md:translate-x-0`}
        aria-label="Sidebar"
      >
        <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

        <nav className="relative h-[71vh]  md:h-[88vh]">
          <ChatroomList
            setIsSidebarOpen={setIsSidebarOpen}
            selectedTab={selectedTab}
          />
          <Friends selectedTab={selectedTab} isSidebarOpen={isSidebarOpen} />
        </nav>
      </aside>

      <section className={`min-h-[90vh] md:ml-80 md:min-h-screen`}>
        {children}
      </section>
    </>
  );
};

export default Sidebar;
