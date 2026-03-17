import type { FastifyInstance } from 'fastify'
import { depositController } from './webhook.controller'


export async function webhooksRoutes(app: FastifyInstance) {
    app.post('/webhooks/deposit',  depositController)
}