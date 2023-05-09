// type Props = {}

import { type ChangeEvent, useState } from "react";
import Input from "./Input";
import Icon from "./Icon";

const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }
  return (
    <aside>
      <div className="flex h-screen w-80 flex-col bg-lightBg px-4 py-8 text-primary">
        <div className="w-full relative ">
        <Icon iconName="search" className="absolute top-2 left-4 text-darkGrey" />
        <Input
          placeholder="Search or start new chat"
          inputSearch={true}
          className="w-full rounded-full bg-darkBg pl-12"
          value={searchTerm}
          onChange={handleSearchChange}
          />
          </div>
        sidebar
      </div>
    </aside>
  );
};

export default Sidebar;
