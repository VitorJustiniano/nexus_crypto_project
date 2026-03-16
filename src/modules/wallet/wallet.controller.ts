import { FastifyReply, FastifyRequest } from 'fastify'
import { getWalletBalance } from './wallet.service'
import '@fastify/jwt'


export async function getWalletBalanceController(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user?.userId as string
    try {
        const balance = await getWalletBalance(userId)
        reply.send(balance)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro interno'
        reply.status(400).send({ error: message })
    }
}    
