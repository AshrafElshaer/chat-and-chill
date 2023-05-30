import React from "react";
import type { SetState } from "../sidebar/Sidebar";

type Props = {
  isInfoSidebarOpen: boolean;
  toggleInfoSidebar:( )=> void;
};

const InfoSidebar = ({ isInfoSidebarOpen, toggleInfoSidebar }: Props) => {
  return (
    <div
      className={`absolute right-0  top-0 z-50 mt-[3.75rem] h-full bg-lightBg  transition-all duration-300 lg:relative lg:right-0 lg:top-0 lg:h-auto
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
        <div className="mt-4 flex flex-col gap-4" role="info sidebar content">
          content
        </div>
      </div>
    </div>
  );
};

export default InfoSidebar;
