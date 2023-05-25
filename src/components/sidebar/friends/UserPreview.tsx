import Avatar from "@/components/Avatar";
import { useUserPresence } from "@/hooks/useUserPresence";
import { api } from "@/utils/api";
import type { User } from "@prisma/client";

type Props = {
  user: User;
  isFriendRequest?: boolean;
  requestId?: number;
};

const UserPreview = ({ user, isFriendRequest, requestId }: Props) => {
  const { isUserOnline } = useUserPresence();
  const { mutate: sendFriendRequest } =
    api.user.sendFriendRequest.useMutation();
  const { mutate: acceptRequest } = api.user.acceptFriendRequest.useMutation();
  return (
    <li className="hover:bg-darkBgLight flex items-center justify-between p-4">
      <div className="flex items-center">
        <Avatar src={user.image} isOnline={isUserOnline(user.id)} />
        <div className="ml-2">
          <p className="text-sm">{user.name}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {!isFriendRequest && !requestId ? (
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
        ) : (
          requestId && (
            <button
              className=" text-sm"
              onClick={() => acceptRequest({ requestId: requestId })}
            >
              Accept
            </button>
          )
        )}
      </div>
    </li>
  );
};

export default UserPreview;
