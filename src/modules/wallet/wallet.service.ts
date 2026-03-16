import { tr } from 'zod/locales'
import { prisma } from '../../database/prisma' 



export async function getWalletBalance(userId: string) {
    // Simula a obtenção do saldo da carteira Wallet
    return await prisma.wallet.findUnique({
        where: { userId },
        include: {
            walletBalance: true 
        }
    })
}
