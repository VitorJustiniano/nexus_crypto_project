import type { FastifyReply, FastifyRequest } from "fastify";
import { executeSwap, getCryptoPrice, quote } from "./swap.service";
import { prisma } from '../../database/prisma' 
import { Token } from "../../generated/prisma/enums";

export async function getCryptoPriceController(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as { crypto: string }
    const crypto = query.crypto as string
    try {
        const price = await getCryptoPrice(crypto)
        reply.send({ price })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro interno'
        reply.status(400).send({ error: message })
    }
}

export async function quoteController(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as { fromToken: string, toToken: string, amount: string }
    const fromToken =query.fromToken as string
    const toToken = query.toToken as string
    const amount = parseFloat(query.amount as string)

    try {
        const quoteResult = await quote(fromToken, toToken, amount)
        reply.send(quoteResult)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro interno'
        reply.status(400).send({ error: message })
    }
}

export async function executeSwapController(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as { fromToken: Token, toToken: Token, amount: number }
    const userId = request.user.userId as string
      try {
        const executeSwapResult = await executeSwap(
            body.fromToken, 
            body.toToken, 
            body.amount, 
            userId
        )
        reply.send(executeSwapResult)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro interno'
        reply.status(400).send({ error: message })
    }
}
