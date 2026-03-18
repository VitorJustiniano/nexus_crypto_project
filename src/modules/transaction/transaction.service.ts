import { prisma } from '../../database/prisma' 


export async function getTransactions(userId: string, page: number, limit: number) {
    const take = limit
        const skip = (page - 1) * limit
        const transactionEntries = await prisma.transaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            skip,
            take
        })
        const totalEntries = await prisma.transaction.count({ where: { userId } })
        return {
            entries: transactionEntries,
            total: totalEntries,
            page,
            limit
        }
    }