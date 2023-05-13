import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "@/server/api/routers/example";
import { userRouter } from "@/server/api/routers/user";
import chatroomRouter from "./routers/chatroom";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  chatroom :chatroomRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
