import { createTRPCRouter  , } from "@/server/api/trpc";
import { userRouter } from "@/server/api/routers/user";
import chatroomRouter from "./routers/chatroom";
import messagesRouter from "./routers/messages";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({

  user: userRouter,
  chatroom :chatroomRouter,
  messages: messagesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
