import { FastifyReply, FastifyRequest } from 'fastify'
import { deposit } from './webhook.service'
import { Token } from '../../generated/prisma/enums'

export async function depositController(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as {userId: string, token: Token, amount: number, idempotencyKey: string}

    try {
        const result = await deposit(
            body.userId,
            body.amount,
            body.token,
            body.idempotencyKey
        )
        reply.status(201).send(result)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro interno'
        reply.status(400).send({ error: message })
    }
}