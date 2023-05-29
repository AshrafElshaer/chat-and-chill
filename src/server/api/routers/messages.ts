import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { pusherServerSide } from "@/server/pusher";
import type { Message } from "@prisma/client";

const uploadedfilesSchema = z.object({
  name: z.string(),
  type: z.string(),
  url: z.string(),
  path: z.string(),
});

const messagesRouter = createTRPCRouter({
  sendNewMessage: protectedProcedure
    .input(
      z.object({
        chatroomId: z.number(),
        text: z.string(),
        files: z.array(uploadedfilesSchema).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { chatroomId, text, files } = input;
      const { id: userId } = ctx.session.user;

      // no files to upload
      if (!files?.length) {
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
          include: {
            user: true,
          },
        });

        await pingPusher(message, chatroomId);

        return message;
      }

      if (files !== undefined && files.length > 0) {
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
            files: {
              create: files.map((file) => ({
                ...file,
                chatroom: {
                  connect: {
                    id: chatroomId,
                  },
                },
              })),
            },
          },
          include: {
            user: true,
            files: true,
          },
        });

        await pingPusher(message, chatroomId);

        return message;
      }
    }),
});

export default messagesRouter;

async function pingPusher(message: Message, chatroomId: number) {
  await pusherServerSide.trigger(`chatroom-${chatroomId}`, "new-message", {
    message,
  });
  await pusherServerSide.trigger("chatrooms", "latest-message", {
    undefined,
  });
}
