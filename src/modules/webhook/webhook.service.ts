import { id } from 'zod/locales';
import { prisma } from '../../database/prisma' 
import { Token, TransactionType } from '../../generated/prisma/enums';

export async function deposit(userId: string, amount: number, token: Token, idempotencyKey: string) {
    const idempotency_exists = await prisma.idempotencyKey.findUnique({ where: { Key:idempotencyKey } })
    if (idempotency_exists) {
        throw new Error('Transação já processada')
    }
    const user_exists = await prisma.user.findUnique({ where: { userId } })
    if (!user_exists) {
        throw new Error('Usuário não encontrado')
    }
    const wallet = await prisma.wallet.findUnique({ where: { userId } })
    if (!wallet) throw new Error('Carteira não encontrada')

    const saldo_atual = await prisma.walletBalance.findUnique({ 
        where: { 
            walletId_token: { 
                walletId: wallet.walletId, 
                token 
            } 
        }  
    })
    const novo_saldo = Number(saldo_atual!.amount) + amount
    
    const legder = await prisma.$transaction([
        prisma.walletBalance.update({data: {
            amount: novo_saldo
        }, where: {
            walletId_token: {
                walletId: wallet.walletId,
                token
            }
        }}),
        prisma.idempotencyKey.create({data: { Key: idempotencyKey }}),

        prisma.ledger.create({data: {
            userId: userId,
            transaction_type: TransactionType.DEPOSIT,
            balance_before: saldo_atual!.amount,
            balance_after: novo_saldo,
            moved_value: amount,
            token
        }}),
    ])
    
    return legder[2]
}