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
        data: { username , bio, image, name },
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
            sender: true,
          },
        },
      },
    });

    return friendRequests?.friendRequestReceived.filter(
      (request) => !request.isAccepted
    );
  }),

  sendFriendRequest: protectedProcedure
    .input(z.object({ senderId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { senderId } = input;
      const { id } = ctx.session.user;

      const isFriendshipExist = await ctx.prisma.friendship.findFirst({
        where: {
          OR: [
            {
              AND: [{ userId: id }, { friendId: senderId }],
            },
            {
              AND: [{ userId: senderId }, { friendId: id }],
            },
          ],
        },
      });

      if (isFriendshipExist) {
        return new TRPCError({
          code: "BAD_REQUEST",
          message: "User is already a friend",
          cause: isFriendshipExist,
        });
      }

      const isFriendRequestExist = await ctx.prisma.friendRequest.findFirst({
        where: {
          AND: [{ senderId }, { receiverId: id }, { isAccepted: false }],
        },
      });

      if (isFriendRequestExist) {
        return new TRPCError({
          code: "BAD_REQUEST",
          message: "Friend request already sent",
        });
      }

      const newFriendRequest = await ctx.prisma.friendRequest.create({
        data: {
          sender: {
            connect: { id },
          },
          receiver: {
            connect: { id: senderId },
          },
        },
      });

      return newFriendRequest;
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
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      return newFriendship;
    }),

  rejectFriendRequest: protectedProcedure
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

      await ctx.prisma.friendRequest.delete({
        where: { id: requestId },
      });

      return true;
    }),

  removeFriend: protectedProcedure
    .input(z.object({ friendId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { friendId } = input;
      const { id } = ctx.session.user;

      const friendship = await ctx.prisma.friendship.findFirst({
        where: {
          OR: [
            {
              AND: [{ userId: id }, { friendId }],
            },
            {
              AND: [{ userId: friendId }, { friendId: id }],
            },
          ],
        },
      });

      if (!friendship) {
        return new TRPCError({
          code: "NOT_FOUND",
          message: "User is not a friend",
        });
      }

      const deleteChatrooms = await ctx.prisma.chatroom.deleteMany({
        where: {
          OR: [
            {
              AND: [
                { users: { some: { id } } },
                { users: { some: { id: friendId } } },
              ],
            },
            {
              AND: [
                { users: { some: { id: friendId } } },
                { users: { some: { id } } },
              ],
            },
          ],
        },
      });

      const deleteMessages = await ctx.prisma.message.deleteMany({
        where: {
          OR: [
            {
              userId: id,
            },
            {
              userId: friendId,
            },
          ],
        },
      });

      const deleteFriend = await ctx.prisma.friendship.delete({
        where: { id: friendship.id },
      });
      return deleteChatrooms && deleteMessages && deleteFriend
        ? true
        : new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Ops! Something went wrong",
          });
    }),
});
