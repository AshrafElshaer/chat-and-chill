import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

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
      return users.filter((user) => user.id !== ctx.session.user.id);
    }),
  getAllFriends: protectedProcedure.query(async ({ ctx }) => {
    const { id } = ctx.session.user;
    const friends = await ctx.prisma.user.findUnique({
      where: { id },
      select: {
        friends: {
          include: {
            friend: true,
          },
        },
        friendsOf: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!friends) return [];

    const allFriends = [
      friends?.friends.map((friend) => friend.friend),
      friends?.friendsOf.map((friend) => friend.user),
    ].flat();

    return [...new Set(allFriends)];
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

    return friendRequests?.friendRequestReceived.filter(
      (request) => !request.isAccepted
    );
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
        return new TRPCError({
          code: "BAD_REQUEST",
          message: "Friend request already sent",
        });
      }

      const isFriendshipExist = await ctx.prisma.friendship.findFirst({
        where: {
          OR: [
            {
              AND: [{ userId: id }, { friendId: receiverId }],
            },
            {
              AND: [{ userId: receiverId }, { friendId: id }],
            },
          ],
        },
      });

      if (isFriendshipExist) {
        return new TRPCError({
          code: "BAD_REQUEST",
          message: "User is already your friend",
        });
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

  acceptFriendRequest: protectedProcedure
    .input(z.object({ requestId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { requestId } = input;

      const friendRequest = await ctx.prisma.friendRequest.findUnique({
        where: { id: requestId },
        select: {
          senderId: true,
          receiverId: true,
        },
      });

      if (!friendRequest) {
        return new TRPCError({
          code: "NOT_FOUND",
        });
      }

      await ctx.prisma.friendRequest.update({
        where: { id: requestId },
        data: { isAccepted: true },
      });

      const newFriendship = await ctx.prisma.friendship.create({
        data: {
          user: {
            connect: { id: friendRequest.senderId },
          },
          friend: {
            connect: { id: friendRequest.receiverId },
          },
        },
      });

      return newFriendship ? { sucsses: true } : { sucsses: false };
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
