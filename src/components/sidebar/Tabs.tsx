import React from "react";
import { Button } from "@/components";

type Props = {
  selectedTab: "chatrooms" | "friends";
  setSelectedTab: React.Dispatch<React.SetStateAction<"chatrooms" | "friends">>;
};

const Tabs = ({ selectedTab, setSelectedTab }: Props) => {
  return (
    <div className="flex">
      <Button
        className={`my-2 text-sm rounded-none h-6 ${
          selectedTab === "chatrooms" ? "bg-lightGray/30" : ""
        }`}
        onClick={() => setSelectedTab("chatrooms")}
      >
        Chats
      </Button>
      <Button
        className={`my-2 text-sm rounded-none h-6 ${
          selectedTab === "friends" ? "bg-lightGray/30" : ""
        }`}
        onClick={() => setSelectedTab("friends")}
      >
        Friends
      </Button>
    </div>
  );
};

export default Tabs;
