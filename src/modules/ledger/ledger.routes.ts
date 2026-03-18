import type { FastifyInstance } from 'fastify'
import { getLedgerController } from './ledger.controller'
import { authenticate } from '../../middlewares/authenticate'

export async function ledgerRoutes(app: FastifyInstance) {
    app.get('/ledger', { onRequest: [authenticate] }, getLedgerController)
}
