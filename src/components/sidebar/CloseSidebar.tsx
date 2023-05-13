import React from 'react'
import type { SetState } from './Sidebar'

type Props = {
    setIsSidebarOpen : SetState<boolean>

}

const CloseSidebar = ({setIsSidebarOpen}: Props) => {
  return (
    <button
    className="flex w-10 h-full justify-start items-center focus:outline-none text-xl  text-gray-400 md:hidden"
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