import type { FastifyReply, FastifyRequest } from "fastify";
import { getLedger} from "./ledger.service";

export async function getLedgerController(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user?.userId as string
    const query = request.query as { page?: string, limit?: string }
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    try {
        const ledgerEntries = await getLedger(userId, page, limit)
        reply.send(ledgerEntries)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro interno'
        reply.status(400).send({ error: message })
    }
}