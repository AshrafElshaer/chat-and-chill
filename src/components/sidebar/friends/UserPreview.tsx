import Avatar from "@/components/Avatar";
import { useUserPresence } from "@/hooks/useUserPresence";
import type { User } from "@prisma/client";

type Props = {
  user: User  ;
};

const UserPreview = ({ user }: Props) => {
  const { isUserOnline } = useUserPresence();
  return (
    <li className="hover:bg-darkBgLight flex items-center justify-between p-4">
      <div className="flex items-center">
        <Avatar src={user.image} isOnline={isUserOnline(user.id)} />
        <div className="ml-2">
          <p className="text-sm">{user.name}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className=" text-sm">Add</button>
      </div>
    </li>
  );
};

export default UserPreview;
