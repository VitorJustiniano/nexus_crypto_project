import { prisma } from '../../database/prisma'
import { Token, TransactionType } from '../../generated/prisma/enums'


export async function withdraw(userId: string, amount: number, token: Token) {
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
    if (saldo_atual === null || Number(saldo_atual.amount) < amount) {
        throw new Error('Saldo insuficiente')
    }
    const novo_saldo = Number(saldo_atual.amount) - amount
    const legder = await prisma.$transaction([
        prisma.walletBalance.update({data: {
            amount: novo_saldo
        }, where: {
            walletId_token: {
                walletId: wallet.walletId,
                token
            }
        }}),
        prisma.ledger.create({data: {
            userId: userId,
            transaction_type: TransactionType.WITHDRAWAL,
            balance_before: saldo_atual.amount,
            balance_after: novo_saldo,
            moved_value: amount,
            token
        }}),
        prisma.transaction.create({data: {
            userId,
            fromToken: token,
            fromAmount: amount,
            fee: 0,
            transaction_type: TransactionType.WITHDRAWAL,
        }})
    ])
    return legder[1]
}