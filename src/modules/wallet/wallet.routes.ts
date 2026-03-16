import type { FastifyInstance } from 'fastify'
import { getWalletBalanceController } from './wallet.controller'
import { authenticate } from '../../middlewares/authenticate'

export async function walletRoutes(app: FastifyInstance) {
    app.get('/wallet/balances', { onRequest: [authenticate] }, getWalletBalanceController)
}