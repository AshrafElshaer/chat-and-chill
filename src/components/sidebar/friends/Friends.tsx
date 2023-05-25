import { type ChangeEvent, useState, useEffect } from "react";
import { api } from "@/utils/api";

import AddNewFriend from "./AddNewFriend";
import { Button, LoadingSpinner } from "@/components";
import UserPreview from "./UserPreview";
import SearchBar from "../SearchBar";
import type { User } from "@prisma/client";

type Props = {
  selectedTab: "chatrooms" | "friends";
  isSidebarOpen: boolean;
};
const Friends = ({ selectedTab, isSidebarOpen }: Props) => {
  const [isAddFriendOpen, setIsAddFriendOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data: friendsResponse, isLoading } =
    api.user.getAllFriends.useQuery();

  const [friends, setFriends] = useState<User[]>(friendsResponse ?? []);

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setSearchTerm(value);

    if (!friendsResponse) return;
    if (value === "") return setFriends(friendsResponse);
    const filteredFriends = friendsResponse.filter(
      (friend) =>
        friend.name && friend.name.toLowerCase().includes(value.toLowerCase())
    );
    setFriends(filteredFriends);
  }

  useEffect(() => {
    if (!friendsResponse) return;
    setFriends(friendsResponse);
  }, [friendsResponse]);

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
            <SearchBar
              placeholder="Search Your Friends"
              handleSearchChange={handleSearch}
              searchTerm={searchTerm}
            />
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
