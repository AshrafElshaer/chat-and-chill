import React from "react";
import { api } from "@/utils/api";

import AddNewFriend from "./AddNewFriend";
import { Avatar, Button } from "@/components";
import { useUserPresence } from "@/hooks/useUserPresence";
import UserPreview from "./UserPreview";

type Props = {
  selectedTab: "chatrooms" | "friends";
  isSidebarOpen: boolean;
};
const FriendsList = ({ selectedTab, isSidebarOpen }: Props) => {
  const [isAddFriendOpen, setIsAddFriendOpen] = React.useState<boolean>(false);
  const { data: friends } = api.user.getAllFriends.useQuery();

  const { isUserOnline } = useUserPresence();

  if (!friends) return null;

  return (
    <>
      <ul
        className={`scrollbar-hide  
    absolute left-0 
    top-0  h-[57vh] w-full
    transform overflow-y-scroll font-medium text-white transition-transform duration-300 md:h-[73vh]
    ${selectedTab === "chatrooms" ? "translate-x-full" : ""}
    ${isSidebarOpen ? "" : "hidden md:block"}
    `}
      >
        {friends &&
          friends.length > 0 &&
          friends.map((friend) => (
           <UserPreview key={friend.id} user={friend} />
          ))}
        {isAddFriendOpen ? (
          <AddNewFriend setIsAddFriendOpen={setIsAddFriendOpen} />
        ) : null}
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
