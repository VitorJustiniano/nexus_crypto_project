import Fastify from 'fastify'
import { healthRoutes } from './routes/health.routes'

export async function buildApp() {
  const app = Fastify({
    logger: true,
  })

  // Routes
  await app.register(healthRoutes)

  return app
}