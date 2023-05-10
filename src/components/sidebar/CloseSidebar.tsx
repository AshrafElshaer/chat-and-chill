import React from 'react'

type Props = {
    setIsSidebarOpen(val: boolean): void;

}

const CloseSidebar = ({setIsSidebarOpen}: Props) => {
  return (
    <button
    className="flex w-full justify-end focus:outline-none mb-2 text-xl text-gray-400 md:hidden"
    aria-label="Close Sidebar"
    data-drawer-target="default-sidebar"
    data-drawer-toggle="default-sidebar"
    aria-controls="default-sidebar"
    onClick={() => setIsSidebarOpen(false)}
  >
    X
  </button>
  )
}

export default CloseSidebar