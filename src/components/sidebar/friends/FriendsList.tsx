import React from "react";
import { api } from "@/utils/api";

import AddNewFriend from "./AddNewFriend";
import { Avatar, Button } from "@/components";
import { useUserPresence } from "@/hooks/useUserPresence";

type Props = {
  selectedTab: "chatrooms" | "friends";
};
const FriendsList = ({ selectedTab }: Props) => {
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
    ${selectedTab === "chatrooms" ? "translate-x-full" : ""}`}
      >
        {friends &&
          friends.length > 0 &&
          friends.map((friend) => (
            <li
              key={friend.id}
              className="hover:bg-darkBgLight flex cursor-pointer items-center justify-between p-2"
            >
              <div className="flex items-center">
                <Avatar src={friend.image} isOnline={isUserOnline(friend.id)} />
                <div className="ml-2">
                  <p className="text-sm">{friend.name}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="text-blue-500 text-xs">Message</button>
                <button className="text-blue-500 text-xs">Remove</button>
              </div>
            </li>
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
