"use client";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";

import { LoadingSpinner } from "@/components";

const Chatroom = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { id: roomId } = router.query;

  const { data: chatroomData } = api.chatroom.getChatroomById.useQuery({
    id: Number(roomId),
  });

  if (!chatroomData) return <LoadingSpinner />;

  const user = session?.user;
  const guest = chatroomData?.users.find((u) => u.id !== user?.id);

  if (!guest) return <LoadingSpinner />;

  return (
    <div className="flex flex-col justify-start text-primary h-screen">
      <div className="mt-[3.75rem] flex h-[3.75rem] w-full items-center justify-start gap-4  bg-lightBg px-4 md:mt-0">
        <Image
          src={guest.image}
          width={35}
          height={35}
          alt="Profile Image"
          className="rounded-full"
        />
        <span className="text-base text-primary">{guest.name}</span>
      </div>
      <div className="flex-grow">conversation</div>
    </div>
  );
};

export default Chatroom;
