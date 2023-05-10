import React from "react";

type Props = {
  setIsSidebarOpen(val: boolean): void;
};

const OpenSidebar = ({ setIsSidebarOpen }: Props) => {
  return (
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
  );
};

export default OpenSidebar;
