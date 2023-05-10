// type Props = {}

import { type ChangeEvent, useState } from "react";
import Input from "../Input";
import ChatroomPreview from "../ChatroomPreview";
import Link from "next/link";
import Button from "../Button";
import { signOut } from "next-auth/react";
import OpenSidebar from "./OpenSidebar";
import CloseSidebar from "./CloseSidebar";
import ChatroomList from "./ChatroomList";
type Props = {
  children: React.ReactNode;
};
const Sidebar = ({ children }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  return (
    <>
      <OpenSidebar setIsSidebarOpen={setIsSidebarOpen} />

      <aside
        id="default-sidebar"
        className={`fixed left-0 top-0 z-40 h-screen w-80 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }  h-full bg-lightBg transition-transform   md:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="  ">
          <ul className="flex flex-col  px-2 py-4 ">
            <li>
              <CloseSidebar setIsSidebarOpen={setIsSidebarOpen} />
            </li>
            <li>
              <Input
                placeholder="Search or start new chat"
                value={searchTerm}
                onChange={handleSearchChange}
                inputSearch
                className="pl-12"
              />
            </li>
          </ul>
          <nav>
            <ChatroomList />
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
        </div>
      </aside>

      <main className={`px-4  md:ml-80`}>{children}</main>
    </>
  );
};

export default Sidebar;
