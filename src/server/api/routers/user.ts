import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  setInterfaceLanguage: protectedProcedure
    .input(z.object({ language: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { interfaceLanguage: input.language },
      });
    }),
});
