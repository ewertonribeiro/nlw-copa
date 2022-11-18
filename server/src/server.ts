import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import ShortUniqueId from "short-unique-id";

const prisma = new PrismaClient({ log: ["query"] });

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  fastify.get("/polls/count", async (_, reply) => {
    const count = await prisma.poll.count();
    return reply.send({ count });
  });

  fastify.get("/users/count", async (_, reply) => {
    const count = await prisma.user.count();
    return reply.send({ count });
  });

  fastify.get("/guesses/count", async (_, reply) => {
    const count = await prisma.guess.count();
    return reply.send({ count });
  });

  fastify.post("/polls", async (req, reply) => {
    const reqBody = z.object({
      title: z.string(),
    });

    const { title } = reqBody.parse(req.body);

    const generate = new ShortUniqueId({ length: 6 });
    const code = String(generate()).toUpperCase();

    await prisma.poll.create({
      data: {
        title,
        code,
      },
    });

    return reply.status(201).send({ code });
  });

  try {
    await fastify.listen({ port: 5000 });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

bootstrap();
