import React from "react";
import { api } from "@/utils/api";

import AddNewFriend from "./AddNewFriend";
import { Button, LoadingSpinner } from "@/components";
import UserPreview from "./UserPreview";

type Props = {
  selectedTab: "chatrooms" | "friends";
  isSidebarOpen: boolean;
};
const Friends = ({ selectedTab, isSidebarOpen }: Props) => {
  const [isAddFriendOpen, setIsAddFriendOpen] = React.useState<boolean>(false);
  const { data: friends, isLoading } = api.user.getAllFriends.useQuery();

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <div
        className={`scrollbar-hide  
    absolute left-0 top-0 
      h-full
    w-full transform overflow-y-scroll font-medium text-white transition-transform duration-300
    ${selectedTab === "chatrooms" ? "translate-x-full" : ""}
    ${isSidebarOpen ? "" : "hidden md:block  "}
    `}
      >
        {isAddFriendOpen ? (
          <AddNewFriend setIsAddFriendOpen={setIsAddFriendOpen} />
        ) : (
          <div className="flex h-full flex-col">
            {friends &&
              friends.length > 0 &&
              friends.map((friend) => (
                <UserPreview key={friend.id} user={friend} />
              ))}
            <Button
              buttonType="secondary"
              className="mb-0 mt-auto rounded-none"
              onClick={() => setIsAddFriendOpen(true)}
            >
              Add new friend
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Friends;
