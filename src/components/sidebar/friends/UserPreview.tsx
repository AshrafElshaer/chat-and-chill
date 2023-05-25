import { useRouter } from "next/router";
import { useUserPresence } from "@/hooks/useUserPresence";
import { api } from "@/utils/api";
import type { User } from "@prisma/client";

import Avatar from "@/components/Avatar";
type Props = {
  user: User;
  isFriendRequest?: boolean;
  isFriend?: boolean;
  requestId?: number;
};

const UserPreview = ({ user, isFriend, isFriendRequest, requestId }: Props) => {
  const router = useRouter();
  const { isUserOnline } = useUserPresence();
  const { mutate: sendFriendRequest } =
    api.user.sendFriendRequest.useMutation();
  const { mutate: acceptRequest } = api.user.acceptFriendRequest.useMutation();
  const { mutateAsync: startChatroom } =
    api.chatroom.createChatroom.useMutation();

  async function handleNewChatroom() {
    const chatroom = await startChatroom({
      friendId: user.id,
    });

    return router.push(`/chatroom/${chatroom.id}`);
  }
  return (
    <li className="hover:bg-darkBgLight flex items-center justify-between p-4">
      <div className="flex items-center">
        <Avatar src={user.image} isOnline={isUserOnline(user.id)} />
        <div className="ml-2">
          <p className="text-sm">{user.name}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {!isFriendRequest && !isFriend && (
          <button
            className=" text-sm"
            onClick={() =>
              sendFriendRequest({
                senderId: user.id,
              })
            }
          >
            Add
          </button>
        )}
        {requestId && (
          <button
            className=" text-sm"
            onClick={() => acceptRequest({ requestId: requestId })}
          >
            Accept
          </button>
        )}
        {isFriend && (
          <button className=" text-sm" onClick={() => void handleNewChatroom()}>
            Message
          </button>
        )}
      </div>
    </li>
  );
};

export default UserPreview;
