import React, { useCallback, useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";

import { api } from "@/utils/api";

import SearchBar from "../SearchBar";
import { Avatar, Button } from "@/components";
import { useUserPresence } from "@/hooks/useUserPresence";

type Props = {
  setIsAddFriendOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type searchResult = {
  id: number;
  name: string | null;
  image: string;
};

function AddNewFriend({ setIsAddFriendOpen }: Props) {
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [foundUsers, setFoundUsers] = React.useState<searchResult[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { isUserOnline } = useUserPresence();

  const { error: searchError, mutate: searchUser } =
    api.user.searchUser.useMutation({
      onSuccess(data) {
        setFoundUsers(data);
      },
    });
  const startSearch = useCallback(() => {
    searchUser({ searchTerm: debouncedSearchTerm });
  }, [debouncedSearchTerm, searchUser]);

  useEffect(() => {
    if (debouncedSearchTerm.length >= 3) {
      startSearch();
    }

    if (debouncedSearchTerm.length <= 2) {
      setFoundUsers([]);
    }
  }, [debouncedSearchTerm, startSearch]);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }
  return (
    <div
      id="hs-slide-down-animation-modal"
      className="hs-overlay fixed left-0 top-0  z-[60]  flex h-full w-full flex-col overflow-y-auto overflow-x-hidden bg-lightBg "
    >
      <h4 className="text-sm w-full text-center">Add New Friend</h4>
      <SearchBar
        placeholder="Search by username or email"
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />

      {
        <div className="flex flex-col">
          {searchError && <div>{searchError.message}</div>}

          {foundUsers.length === 0 && debouncedSearchTerm.length >= 3 && (
            <div className="flex items-center justify-center px-4 py-2">
              <p className="text-sm font-semibold">
                No users found with that username or email
              </p>
            </div>
          )}

          {foundUsers.length !== 0 &&
            foundUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between px-4 py-2"
              >
                <div className="flex items-center">
                  <Avatar src={user.image} isOnline={isUserOnline(user.id)} />
                  <div className="ml-2">
                    <p className="text-sm font-semibold">{user.name}</p>
                  </div>
                </div>
                <button className="text-blue-500 text-xs ">
                  Send Request
                </button>
              </div>
            ))}
        </div>
      }

      <Button
        className="mt-auto rounded-none"
        onClick={() => setIsAddFriendOpen(false)}
      >
        Cancel
      </Button>
      <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 m-3 mt-0 opacity-0 transition-all ease-out sm:mx-auto sm:w-full sm:max-w-lg"></div>
    </div>
  );
}

export default AddNewFriend;
