import { env } from "@/env.mjs";
import Pusher from "pusher-js";

export const pusherClientSide = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: "us2",
});
