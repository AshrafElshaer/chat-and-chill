// type Props = {}

import { type ChangeEvent, useState } from "react";
import Input from "./Input";

const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }
  return (
    <aside>
      <div className="flex h-screen w-80 flex-col bg-lightBg px-4 py-8 text-primary">
        <div className="w-full">

        <Input
          placeholder="Search or start new chat"
          inputSearch={true}
          className="w-full rounded-full bg-darkBg"
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
