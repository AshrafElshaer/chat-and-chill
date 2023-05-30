import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { CloseSidebar, OpenSidebar } from "./controllers";
import type { SetState } from "./Sidebar";
import Avatar from "../Avatar";
import UserMenu from "../UserMenu";

type Props = {
  setIsSidebarOpen: SetState<boolean>;
  isSidebarOpen: boolean;
};

const Topbar = ({ setIsSidebarOpen, isSidebarOpen }: Props) => {
  const { data: session } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  return (
    <div className="fixed left-0 top-0 flex h-[3.75rem] w-full items-center justify-between bg-lightBg px-4  md:justify-end border-b-[1px] border-b-lightGray">
      {isSidebarOpen ? (
        <CloseSidebar setIsSidebarOpen={setIsSidebarOpen} />
      ) : (
        <OpenSidebar setIsSidebarOpen={setIsSidebarOpen} />
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
