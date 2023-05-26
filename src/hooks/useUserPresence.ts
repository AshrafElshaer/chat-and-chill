import { useEffect } from "react";
import { pusherClientSide } from "@/utils/pusherClientSide";

import {type PresenceChannel } from "pusher-js";

type Member = {
  id: number;
  username: string;
  name: string;
  email: string;
}

 const useUserPresence = () => {
  const channel = pusherClientSide.subscribe(
    "presence-users-channel"
  ) as PresenceChannel;

  useEffect(() => {
    return () => {
      channel.unsubscribe();
    };
  }, [channel]);

  const connectedUsers = Object.values(
    channel.members.members as Member[]
  ).map((member) => member);

  function isUserOnline(userId: number) {
    return connectedUsers.find((user) => user.id === userId) ? true : false;
  }


  return { connectedUsers, isUserOnline };
};

export default useUserPresence;
