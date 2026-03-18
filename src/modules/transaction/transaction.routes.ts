import type { FastifyInstance } from 'fastify'
import { getTransactionsController} from './transaction.controller'
import { authenticate } from '../../middlewares/authenticate'

export async function transactionRoutes(app: FastifyInstance) {
    app.get('/transactions', { onRequest: [authenticate] }, getTransactionsController)
}
