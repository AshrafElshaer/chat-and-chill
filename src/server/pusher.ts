import Pusher, { UserChannelData } from "pusher";
import { env } from "@/env.mjs";

export const pusherServerSide = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: env.PUSHER_CLUSTER,
  useTLS: true,
});
