import Fastify from "fastify";
import cors from "@fastify/cors";

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  fastify.get("/", async (_, reply) => {
    return reply.send({ hello: "world" });
  });

  try {
    await fastify.listen({ port: 5000 });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

bootstrap();
