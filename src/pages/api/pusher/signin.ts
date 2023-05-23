import { getServerAuthSession } from "@/server/auth";
import { pusherServerSide } from "@/server/pusher";
import type { NextApiRequest, NextApiResponse } from "next";

export interface AuthRequest extends NextApiRequest {
  body: {
    socket_id: string;
    channel_name: string;
  };
}

export default async function handler(req: AuthRequest, res: NextApiResponse) {
  const socketId: string = req.body.socket_id;

  const session = await getServerAuthSession({ req, res });

  if (!session) {
    return res.status(401).send("Unauthorized");
  }

  const user = {
    id: session.user.id.toString(),
    user_info: {
      username: session.user.username,
      name: session.user.name,
      email: session.user.email,
    },
    // watchlist: [session.user],
  };
  const authResponse = pusherServerSide.authenticateUser(socketId, user);
  console.log(authResponse);
  res.send(authResponse);
}
