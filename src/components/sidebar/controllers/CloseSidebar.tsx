import React from "react";
import type { SetState } from "../Sidebar";

type Props = {
  toggleSidebar: () => void;
};

const CloseSidebar = ({ toggleSidebar }: Props) => {
  return (
    <button
      className="flex h-full w-10 items-center justify-start text-xl text-gray-400  focus:outline-none md:hidden"
      aria-label="Close Sidebar"
      data-drawer-target="default-sidebar"
      data-drawer-toggle="default-sidebar"
      aria-controls="default-sidebar"
      onClick={() => toggleSidebar()}
    >
      X
    </button>
  );
};

export default CloseSidebar;
