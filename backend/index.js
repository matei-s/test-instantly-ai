// ESM
import Fastify from 'fastify';
import routes from './src/routes/index.js';

/**
 * @type {import('fastify').FastifyInstance} Instance of Fastify
 */
const fastify = Fastify({
  logger: true
});

// Register CORS plugin
await fastify.register(import('@fastify/cors'), {
  origin: ['http://localhost:3000'], // Allow frontend origin
  methods: ['GET', 'POST', 'OPTIONS']
});

fastify.register(routes);

fastify.listen({ port: process.env.PORT }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})
