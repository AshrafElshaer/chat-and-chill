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
  searchUser: protectedProcedure
    .input(z.object({ searchTerm: z.string().min(3) }))
    .mutation(async ({ input, ctx }) => {
      const { searchTerm } = input;

      const users = await ctx.prisma.user.findMany({
        where: {
          OR: [
            {
              username: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          image: true,
        },
      });
      return users.filter((user) => user.id !== ctx.session.user.id)
    }),

  getFriendRequests: protectedProcedure.query(async ({ ctx }) => {
    const { id } = ctx.session.user;
    const friendRequests = await ctx.prisma.user.findUnique({
      where: { id },
      select: {
        friendRequestReceived: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return friendRequests?.friendRequestReceived;
  }),

  sendFriendRequest: protectedProcedure
    .input(z.object({ receiverId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { receiverId } = input;
      const { id } = ctx.session.user;

      const isFriendRequestExist = await ctx.prisma.friendRequest.findFirst({
        where: {
          AND: [{ senderId: id }, { receiverId }],
        },
      });

      if (isFriendRequestExist) {
        return { sucsses: false };
      }

      const newFriendRequest = await ctx.prisma.friendRequest.create({
        data: {
          sender: {
            connect: { id },
          },
          receiver: {
            connect: { id: receiverId },
          },
        },
      });

      return newFriendRequest ? { sucsses: true } : { sucsses: false };
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
