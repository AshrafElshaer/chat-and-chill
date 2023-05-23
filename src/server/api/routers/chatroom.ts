import { z } from "zod";

import {
  createTRPCRouter,
  // publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

const chatroomRouter = createTRPCRouter({
  getAllChatroom: protectedProcedure.query(async ({ ctx }) => {
    const { id } = ctx.session.user;
    const chatroom = await ctx.prisma.chatroom.findUnique({
      where: { id },
      include: {
        users: true,
        messages: true,
      },
    });
    return chatroom;
  }),
  getUserChatrooms: protectedProcedure.query(async ({ ctx }) => {
    const { id } = ctx.session.user;
    const user = await ctx.prisma.user.findUnique({
      where: { id },
      select: {
        chatrooms: {
          orderBy: {
            lastMessageAt: "desc",
          },
          include: {
            users: true,
            messages: true,
          },
        },
      },
    });
    return user;
  }),

  getChatroomById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const { id } = input;
      const chatroom = await ctx.prisma.chatroom.findUnique({
        where: { id },
        include: {
          users: true,
          messages: {
            orderBy: {
              createdAt: "asc",
            },
            include: { user: true },
          },
        },
      });
      return chatroom;
    }),
});

export default chatroomRouter;
