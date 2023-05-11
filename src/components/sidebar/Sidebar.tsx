// type Props = {}

import { type ChangeEvent, useState } from "react";
import Input from "../Input";
import Button from "../Button";
import { signOut, useSession } from "next-auth/react";
import OpenSidebar from "./OpenSidebar";
import CloseSidebar from "./CloseSidebar";
import ChatroomList from "./ChatroomList";
import Image from "next/image";
import { api } from "@/utils/api";
type Props = {
  children: React.ReactNode;
};
const Sidebar = ({ children }: Props) => {
  const { data: session } = useSession();
  const { data: chatroomsResponse, error: chatroomsError } =
    api.user.getUserChatrooms.useQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }
  if (chatroomsError) return console.log(chatroomsError);
  if (!chatroomsResponse) return 
  return (
    <>
      <div className="fixed top-0 flex h-[3.75rem] w-full items-center justify-between bg-lightBg px-4 md:justify-end">
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
        }  h-full bg-lightBg transition-transform   md:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="my-4 px-2">
          <Input
            placeholder="Search or start new chat"
            value={searchTerm}
            onChange={handleSearchChange}
            inputSearch
            className="pl-12 "
          />
        </div>

        <nav>
          <ChatroomList chatrooms={chatroomsResponse.chatrooms} />
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

      <main className={`px-4  md:ml-80`}>{children}</main>
    </>
  );
};

export default Sidebar;
