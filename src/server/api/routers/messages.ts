import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

const messagesRouter = createTRPCRouter({
  sendNewMessage: protectedProcedure
    .input(z.object({ chatroomId: z.number(), text: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { chatroomId, text } = input;
      const { id: userId } = ctx.session.user;
      const message = await ctx.prisma.message.create({
        data: {
          text,
          user: {
            connect: {
              id: userId,
            },
          },
          chatroom: {
            connect: {
              id: chatroomId,
            },
          },
        },
      });
      return message;
    }),
});

export default messagesRouter;
