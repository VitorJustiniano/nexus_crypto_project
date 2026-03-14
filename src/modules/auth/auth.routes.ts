import type { FastifyInstance } from 'fastify'
import { loginController, registerController } from './auth.controller'

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', registerController)
  app.post('/auth/login', loginController)
}
