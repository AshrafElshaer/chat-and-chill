import React from "react";

type Props = {
  selectedTab: "chatrooms" | "friends";
};
const FriendsList = ({ selectedTab }: Props) => {
  return (
    <ul
      className={`scrollbar-hide  
    h-[80vh] max-h-[57vh] 
    overflow-y-scroll font-medium  text-white md:max-h-[73.5vh]
    absolute top-0 left-0 w-full transform transition-transform duration-300
    ${
      selectedTab === "chatrooms" ? "translate-x-full" : ""
    }`}
    >
      FriendsList
    </ul>
  );
};

export default FriendsList;
