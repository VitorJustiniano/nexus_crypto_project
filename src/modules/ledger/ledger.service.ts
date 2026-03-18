import { prisma } from '../../database/prisma' 


export async function getLedger(userId: string, page: number, limit: number) {
    const take = limit
    const skip = (page - 1) * limit
    const ledgerEntries = await prisma.ledger.findMany({
        where: { userId },
        orderBy: { DateTime: 'desc' },
        skip,
        take
    })
    const totalEntries = await prisma.ledger.count({ where: { userId } })
    return {
        entries: ledgerEntries,
        total: totalEntries,
        page,
        limit
    }
}