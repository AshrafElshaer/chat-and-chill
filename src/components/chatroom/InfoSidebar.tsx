import React from "react";

import type { User, File } from "@prisma/client";
import { Avatar, Icon } from "@/components";
import { useUserPresence } from "@/hooks";
import { FilePreview } from "./Message";

type Props = {
  isInfoSidebarOpen: boolean;
  toggleInfoSidebar: () => void;
  guest: User;
  files: File[];
};

const InfoSidebar = ({
  isInfoSidebarOpen,
  toggleInfoSidebar,
  guest,
  files,
}: Props) => {
  const { isUserOnline } = useUserPresence();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  return (
    <>
      <aside
        className={`= absolute  right-0 top-0 z-20  h-screen overflow-hidden  bg-lightBg pt-[3.75rem] transition-all duration-300 lg:relative lg:right-0 lg:top-0
      ${isInfoSidebarOpen ? "w-80" : "w-0"}`}
      >
        <div className="p-4" role="info sidebar contaianer">
          <div
            className="flex items-center justify-start gap-4"
            role="info side bar header"
          >
            <button
              className=" h-6 w-6 cursor-pointer  text-primary lg:hidden"
              onClick={() => toggleInfoSidebar()}
            >
              X
            </button>
            <h3>Contact Info</h3>
          </div>
          <div
            className="mt-4 flex flex-col  gap-4"
            role="info sidebar content"
          >
            <div
              role="info header"
              className="flex flex-col items-center gap-4 "
            >
              <Avatar
                src={guest.image}
                isOnline={false}
                width={70}
                height={70}
              />
              <h3>{guest.name}</h3>
              <p>{isUserOnline(guest.id) ? "Online" : "Offline"}</p>

              <div className="mt-4 flex items-center gap-4">
                <button className="flex items-center gap-2 rounded-full bg-black p-3">
                  <Icon iconName="video" size="1.5rem" />
                </button>
                <button className="flex items-center gap-2 rounded-full bg-black p-3">
                  <Icon iconName="phone" size="1.5rem" />
                </button>
              </div>
            </div>
            <div role="About ">
              <h6 className="mb-3 text-sm">About</h6>
              <p className="text-xs text-lightGray">
                {guest.bio !== "" ? guest.bio : "No Status yet!"}{" "}
              </p>
            </div>

            <div role="Media & Files">
              <h6 className="mb-3 text-sm">Shared Files</h6>
              {files && files.length > 0 ? (
                <ul className="">
                  {files.slice(0, 10).map((file) => (
                    <li key={file.id} className="inline-block">
                      <FilePreview
                        file={file}
                        width={40}
                        height={40}
                        iconSize="3rem"
                      />
                    </li>
                  ))}
                  <li className="mt-2">
                    <button onClick={() => setIsDialogOpen(true)}>
                      See More
                    </button>
                  </li>
                </ul>
              ) : (
                "No files shared yet"
              )}
            </div>
          </div>
        </div>
      </aside>
      <dialog
        className="absolute inset-0 bottom-0 left-0 top-0 z-50 h-full w-full bg-black bg-opacity-50"
        open={isDialogOpen}
      >
        <div className="scrollbar-hide absolute left-1/2 top-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 overflow-scroll rounded-lg bg-lightBg p-4 text-white">
          <button onClick={() => setIsDialogOpen(false)}>X</button>
          <h3 className="text-center">Shared Files</h3>
          <ul className="mx-auto mt-6 text-center md:text-left">
            {files.map((file) => (
              <li key={file.id} className="inline-block">
                <FilePreview file={file} />
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </>
  );
};

export default InfoSidebar;
