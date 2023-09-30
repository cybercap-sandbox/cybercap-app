import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const chatSessionRouter = createTRPCRouter({
  saveMessage: protectedProcedure
    .input(
      z.object({
        chatSessionId: z.string(),
        message: z.string(),
        role: z.enum(["user", "assistant", "system", "function"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.chatMessage.create({
        data: {
          sessionId: input.chatSessionId,
          content: input.message,
          role: input.role,
        },
      });
    }),

  createChatSession: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.chatSession.create({
        data: {
          id: input.id,
          name: input.name,
          userId: ctx.session.user.id,
        },
        include: {
          messages: true,
        },
      });
    }),

  updateChatSession: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.chatSession.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      });
    }),

  deleteChatSession: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.chatSession.delete({
        where: {
          id: input.id,
        },
      });
    }),

  getAllStreamsWithMessagesForCurrentUser: protectedProcedure.query(
    async ({ ctx }) => {
      return await ctx.prisma.chatSession.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          messages: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }
  ),
  getChatSessionWithMessages: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.chatSession.findUnique({
        where: {
          id: input.id,
        },
        include: {
          messages: true,
        },
      });
    }),
});
