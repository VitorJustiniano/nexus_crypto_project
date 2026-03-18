import type { FastifyReply, FastifyRequest } from "fastify";
import { withdraw } from "./withdrawal.service";
import { Token } from "../../generated/prisma/enums";

export async function withdrawController(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as { token: Token, amount: number }
    const userId = request.user.userId as string
    try {
        const result = await withdraw(
            userId,
            body.amount,
            body.token
        )
        reply.status(200).send(result)
     } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro interno'
        reply.status(400).send({ error: message })
    }
}