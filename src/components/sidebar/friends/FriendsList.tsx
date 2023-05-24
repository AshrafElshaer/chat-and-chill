import React from "react";
import AddNewFriend from "./AddNewFriend";
import { Button } from "@/components";

type Props = {
  selectedTab: "chatrooms" | "friends";
};
const FriendsList = ({ selectedTab }: Props) => {
  const [isAddFriendOpen, setIsAddFriendOpen] = React.useState<boolean>(false);
  return (
    <>
      <ul
        className={`scrollbar-hide  
    md:h-[73vh] absolute 
    left-0  top-0 h-[57vh]
    w-full transform overflow-y-scroll font-medium text-white transition-transform duration-300
    ${selectedTab === "chatrooms" ? "translate-x-full" : ""}`}
      >
        FriendsList
        {isAddFriendOpen ? <AddNewFriend setIsAddFriendOpen={setIsAddFriendOpen} /> : null}
        <Button
          className="rounded-none"
          onClick={() => setIsAddFriendOpen(true)}
        >
          Add new friend
        </Button>
      </ul>
    </>
  );
};

export default FriendsList;
