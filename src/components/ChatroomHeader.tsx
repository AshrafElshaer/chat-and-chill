
import type { User } from "@prisma/client";

import Avatar from "./Avatar";
import Icon from "./Icon";

type Props = {
  guest: User;
  isGeustOnline: boolean;
};

const ChatroomHeader = ({ guest, isGeustOnline }: Props) => {
  return (
    <div className="mt-[3.75rem] flex h-[3.75rem] w-full items-center justify-between gap-4 bg-lightBg px-4">
      <div className="flex items-center gap-4">
        <Avatar src={guest.image} isOnline={isGeustOnline} />
        <span className="text-base text-primary">{guest.name}</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="rounded-full bg-black p-2">
          <Icon iconName="video" size="1.2rem" />
        </button>
        <button className="rounded-full bg-black p-2">
          <Icon iconName="phone" size="1.2rem" />
        </button>
        <button className="rounded-full bg-black p-2">
          <Icon iconName="dots" size="1.2rem" />
        </button>
      </div>
    </div>
  );
};

export default ChatroomHeader;
