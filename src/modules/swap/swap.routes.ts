import type { FastifyInstance } from 'fastify'
import { executeSwapController, getCryptoPriceController, quoteController } from './swap.controller'
import { authenticate } from '../../middlewares/authenticate'

export async function swapRoutes(app: FastifyInstance) {
  app.get<{ Querystring: { crypto: string } }>('/swap/price',{ onRequest: [authenticate] }, getCryptoPriceController)
  app.get<{ Querystring: { fromToken: string, toToken: string, amount: string } }>('/swap/quote',{ onRequest: [authenticate] }, quoteController)
  app.post('/swap/execute',{ onRequest: [authenticate] }, executeSwapController)
}