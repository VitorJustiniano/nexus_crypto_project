import type { FastifyInstance } from 'fastify'
import { withdrawController } from './withdrawal.controller'
import { authenticate } from '../../middlewares/authenticate'

export async function withdrawalRoutes(app: FastifyInstance) {
    app.post('/withdrawal', { onRequest: [authenticate] }, withdrawController)
}   