"use client";
import { useRouter } from "next/router";

const Chatroom = () => {
  // get id from router
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="grid place-content-center text-2xl text-primary min-h-screen">{id}</div>
  );
};

export default Chatroom;
