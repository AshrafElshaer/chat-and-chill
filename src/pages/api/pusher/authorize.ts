import type { NextApiResponse } from "next";
import type { AuthRequest } from "./signin";
import { pusherServerSide } from "@/server/pusher";
import { getServerAuthSession } from "@/server/auth";

export default async function handler(req: AuthRequest, res: NextApiResponse) {
  const socketId = req.body.socket_id;
  const channelName = req.body.channel_name;

  if (/^presence-/.test(channelName)) {
    // If the request is for a presence channel include some data about the user
    // in the call to authenticate
    const session = await getServerAuthSession({ req, res });
    if (!session) {
      return res.status(401).send("Unauthorized");
    }

    const presenceData = {
      user_id: session.user.id.toString(),
      user_info: {
        username: session.user.username,
        name: session.user.name,
        email: session.user.email,
      },
    };
    const auth = pusherServerSide.authorizeChannel(
      socketId,
      channelName,
      presenceData
    );
    res.send(auth);
  } else {
    const auth = pusherServerSide.authorizeChannel(socketId, channelName);
    res.send(auth);
  }
}
