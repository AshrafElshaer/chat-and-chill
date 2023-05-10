// type Props = {}

import { type ChangeEvent, useState } from "react";
import Input from "./Input";
import ChatroomPreview from "./ChatroomPreview";
import { chatroom } from "@/sample-data/chatRoom";
import Link from "next/link";
import Button from "./Button";
import { signOut } from "next-auth/react";
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
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        onClick={() => setIsSidebarOpen(true)}
        className="ml-3 mt-2 inline-flex h-10  rounded-lg p-2 text-sm text-gray-500 focus:outline-none dark:text-gray-400 md:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="h-6 w-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className={`fixed left-0 top-0 z-40 h-screen w-80 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }  transition-transform md:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full   bg-lightBg  pt-4">
          <ul className="flex flex-col space-y-4 px-2 ">
            <li className="  text-xl text-gray-400 md:hidden">
              <button
                className="flex w-full justify-end focus:outline-none"
                aria-label="Close Sidebar"
                onClick={() => setIsSidebarOpen(false)}
              >
                X
              </button>
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

          <ul className="scrollbar-hide mt-4 h-[75vh] overflow-y-scroll font-medium">
            <li>
              <Link href="/chatroom">
                <ChatroomPreview chatroom={chatroom} />
              </Link>
            </li>
            <li>
              <Link href="/chatroom">
                <ChatroomPreview chatroom={chatroom} />
              </Link>
            </li>
            <li>
              <Link href="/chatroom">
                <ChatroomPreview chatroom={chatroom} />
              </Link>
            </li>
            <li>
              <Link href="/chatroom">
                <ChatroomPreview chatroom={chatroom} />
              </Link>
            </li>
            <li>
              <Link href="/chatroom">
                <ChatroomPreview chatroom={chatroom} />
              </Link>
            </li>
            <li>
              <Link href="/chatroom">
                <ChatroomPreview chatroom={chatroom} />
              </Link>
            </li>
            <li>
              <Link href="/chatroom">
                <ChatroomPreview chatroom={chatroom} />
              </Link>
            </li>
            <li>
              <Link href="/chatroom">
                <ChatroomPreview chatroom={chatroom} />
              </Link>
            </li>
            <li>
              <Link href="/chatroom">
                <ChatroomPreview chatroom={chatroom} />
              </Link>
            </li>
            <li>
              <Link href="/chatroom">
                <ChatroomPreview chatroom={chatroom} />
              </Link>
            </li>
          </ul>
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
