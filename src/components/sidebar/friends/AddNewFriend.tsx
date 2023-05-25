import { api } from "@/utils/api";

import { Button } from "@/components";

import SearchList from "./SearchList";
import FriendRequests from "./FriendRequests";

type Props = {
  setIsAddFriendOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function AddNewFriend({ setIsAddFriendOpen }: Props) {
  return (
    <div
      id="hs-slide-down-animation-modal"
      className="hs-overlay fixed left-0 top-0 flex  h-full w-full   flex-col overflow-y-auto overflow-x-hidden  "
    >
      <SearchList />

      <FriendRequests />

      <Button
        buttonType="secondary"
        className=" mb-0 mt-auto rounded-none "
        onClick={() => setIsAddFriendOpen(false)}
      >
        Cancel
      </Button>
    </div>
  );
}

export default AddNewFriend;
