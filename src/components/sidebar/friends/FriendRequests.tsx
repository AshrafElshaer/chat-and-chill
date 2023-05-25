import { api } from "@/utils/api";
import React from "react";
import UserPreview from "./UserPreview";

function FriendRequests() {
  const { data: friendRequests } = api.user.getFriendRequests.useQuery();
  return (
    <ul className="scrollbar-hide flex h-1/2 flex-col gap-3 overflow-y-scroll">
      <li>
        <h4 className="my-2 w-full text-center text-sm">Friend Requests</h4>
      </li>
      {!friendRequests?.length ? (
        <li className=" text-center">
          <p className="text-sm font-semibold text-lightGray">No friend requests yet !</p>
        </li>
      ) : (
        friendRequests?.map((req) => (
          <UserPreview key={req.id} user={req.sender} />
        ))
      )}
    </ul>
  );
}

export default FriendRequests;
