import Fastify from 'fastify'
import { healthRoutes } from './routes/health.routes'
import { authRoutes } from './modules/auth/auth.routes'
import jwt from '@fastify/jwt'
import { env } from 'node:process'
import { walletRoutes } from './modules/wallet/wallet.routes'
import { webhooksRoutes } from './modules/webhook/webhook.routes'
import { swapRoutes } from './modules/swap/swap.routes'
import { withdrawalRoutes } from './modules/withdrawal/withdrawal.routes'


export async function buildApp() {
  const app = Fastify({
    logger: true,
  })

  // Routes
  await app.register(jwt, {
    secret: env.JWT_SECRET!})
  await app.register(healthRoutes)
  await app.register(authRoutes)
  await app.register(walletRoutes)
  await app.register(webhooksRoutes)
  await app.register(swapRoutes)
  await app.register(withdrawalRoutes)

  return app
}

