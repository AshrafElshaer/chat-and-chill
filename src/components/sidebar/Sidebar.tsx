import { useState } from "react";



import { ChatroomList } from "./chatroomsList";
import { Friends } from "./friends";

import Topbar from "./Topbar";
import { Tabs } from "./controllers";
import { useSidebars } from "@/hooks";

type Props = {
  children: React.ReactNode;
};

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

const Sidebar = ({ children }: Props) => {

  const {isSidebarOpen , toggleSidebar} = useSidebars()
  const [selectedTab, setSelectedTab] = useState<"chatrooms" | "friends">(
    "chatrooms"
  );



  return (
    <>
      <Topbar
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      <aside
        id="default-sidebar"
        className={`fixed left-0 top-14 z-40 h-screen w-80  md:top-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }  h-full overflow-hidden bg-lightBg   transition-transform  md:translate-x-0`}
        aria-label="Sidebar"
      >
        <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

        <nav className="relative h-[76vh]  md:h-[90vh]">
          <ChatroomList
            toggleSidebar={toggleSidebar}
            selectedTab={selectedTab}
          />
          <Friends
            selectedTab={selectedTab}
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </nav>
      </aside>

      <section className={` md:ml-80 md:min-h-screen`}>{children}</section>
    </>
  );
};

export default Sidebar;
