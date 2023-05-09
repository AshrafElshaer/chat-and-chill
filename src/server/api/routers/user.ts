import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  updateUserInfo: protectedProcedure
    .input(
      z.object({
        username: z.string(),

        bio: z.string().max(160).nullable(),
        image: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { username, bio, image } = input;
      const { id } = ctx.session.user;

      const updatedUser = await ctx.prisma.user.update({
        where: { id },
        data: { username, bio, image },
      });
      return updatedUser ? { sucsses: true } : { sucsses: false };
    }),
    
  validateUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { username } = input;
      const isUsernameExist = await ctx.prisma.user.findUnique({
        where: { username },
        select: { username: true },
      });

      return isUsernameExist ? { isAvailable: false } : { isAvailable: true };
    }),
});
