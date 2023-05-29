import { z, infer } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { pusherServerSide } from "@/server/pusher";


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

      let createdMessage;

      // no files to upload
      if (files === undefined) {
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

        createdMessage = message;
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

        createdMessage = message;
      }

      await pusherServerSide.trigger(`chatroom-${chatroomId}`, "new-message", {
        createdMessage,
      });
      await pusherServerSide.trigger("chatrooms", "latest-message", {
        undefined,
      });

      return files;
    }),
});

export default messagesRouter;
