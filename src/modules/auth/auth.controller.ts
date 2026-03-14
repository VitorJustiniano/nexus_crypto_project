import type { FastifyReply, FastifyRequest } from "fastify";
import { login, register } from "./auth.service";

export async function registerController(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as { name: string, email: string, password: string }
    try {
        const user = await register(body)
        reply.status(201).send(user)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro interno'
        reply.status(400).send({ error: message })
    }
}

export async function loginController(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as { email: string, password: string }
    try {
        const user = await login(body)
        const accessToken = request.server.jwt.sign({ userId: user.userId }, { expiresIn: '15m' })
        const refreshToken = request.server.jwt.sign({ userId: user.userId }, { expiresIn: '7d' })
        reply.send({ accessToken, refreshToken })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro interno'
        reply.status(400).send({ error: message })
    }
}