import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUserChatrooms: protectedProcedure.query(async ({ ctx }) => {
    const { id } = ctx.session.user;
    const user = await ctx.prisma.user.findUnique({
      where: { id },
      select: {
        chatrooms: {
          include: {
            users: true,
            messages: true,
          },
        },
      },
    });
    return user;
  }),
  updateUserInfo: protectedProcedure
    .input(
      z.object({
        username: z.string(),
        name: z.string(),
        bio: z.string().max(160),
        image: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { username, bio, image, name } = input;
      const { id } = ctx.session.user;

      const updatedUser = await ctx.prisma.user.update({
        where: { id },
        data: { username, bio, image, name },
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

  // createNewChat: protectedProcedure.query(async ({ ctx }) => {
  //   const { id } = ctx.session.user;
  //   const newChat = await ctx.prisma.chatroom.create({
  //     data: {
  //       users: {
  //         connect: [{ id }, { id: 1 }],
  //       },
  //       messages: {
  //         create: [
  //           {
  //             text: "Hello",
  //             user: {
  //               connect: { id },
  //             },
  //           },
  //           {
  //             text: "Hi",
  //             user: {
  //               connect: { id: 1 },
  //             },
  //           },
  //         ],
  //       },
  //     },
  //     include: {
  //       messages: {
  //         include: {
  //           user: true,
  //         },
  //       },
  //     },
  //   });
  //   return newChat;
  // }),
});
