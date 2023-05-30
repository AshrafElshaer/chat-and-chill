import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { CloseSidebar, OpenSidebar } from "./controllers";
import type { SetState } from "./Sidebar";
import Avatar from "../Avatar";
import UserMenu from "../UserMenu";

type Props = {
  toggleSidebar: ()=> void;
  isSidebarOpen: boolean;
};

const Topbar = ({ toggleSidebar, isSidebarOpen }: Props) => {
  const { data: session } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  return (
    <div className="fixed left-0 top-0 flex h-[3.75rem] w-full items-center justify-between bg-lightBg px-4  md:justify-end border-b-[1px] border-b-lightGray z-40">
      {isSidebarOpen ? (
        <CloseSidebar toggleSidebar={toggleSidebar} />
      ) : (
        <OpenSidebar toggleSidebar={toggleSidebar} />
      )}
      {session ? (
        <>
          <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <Avatar src={session.user.image} isOnline={false} />
          </button>
          {isUserMenuOpen ? <UserMenu session={session} /> : null}
        </>
      ) : null}
    </div>
  );
};

export default Topbar;
