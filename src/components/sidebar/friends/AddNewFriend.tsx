import React, { useCallback, useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";

import { api } from "@/utils/api";
import type { User } from "@prisma/client";

import SearchBar from "../SearchBar";
import { Avatar, Button } from "@/components";
import { useUserPresence } from "@/hooks/useUserPresence";
import UserPreview from "./UserPreview";
import SearchList from "./SearchList";

type Props = {
  setIsAddFriendOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function AddNewFriend({ setIsAddFriendOpen }: Props) {
  const { data: friendRequests } = api.user.getFriendRequests.useQuery();

  const { mutate: sendFriendRequest } =
    api.user.sendFriendRequest.useMutation();

  const { mutate: acceptRequest } = api.user.acceptFriendRequest.useMutation();

  return (
    <div
      id="hs-slide-down-animation-modal"
      className="hs-overlay fixed left-0 top-0  z-[60]  flex h-full w-full flex-col overflow-y-auto overflow-x-hidden bg-lightBg py-4 "
    >
      <h4 className="w-full text-center text-sm">Add New Friend</h4>
      <SearchList />

      <h4 className="w-full text-center text-sm">Friend Requests</h4>

      {!friendRequests?.length ? (
        <div className="flex items-center justify-center px-4 py-2">
          <p className="text-sm font-semibold">No friend requests</p>
        </div>
      ) : (
        <ul>
          {friendRequests?.map((req) => (
            <UserPreview key={req.id} user={req.sender} />
          ))}
        </ul>
      )}

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
