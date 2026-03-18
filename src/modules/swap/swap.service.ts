import { number } from 'zod'
import { prisma } from '../../database/prisma'
import { Token, TransactionType } from '../../generated/prisma/browser'
import { getWalletBalance } from '../wallet/wallet.service'



export async function getCryptoPrice(crypto: string) {
    //traduz o simbolo do token para o id do CoinGecko    
    const coinGeckoIds: Record<string, string> =  {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    }
    // testa se a criptomoeda é suportada
    const coinGeckoId = coinGeckoIds[crypto]
    if (!coinGeckoId) {
        throw new Error('Criptomoeda não suportada')
    }
    // consulta o preço na API do CoinGecko em BRL
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?vs_currencies=brl&ids=${coinGeckoId}&x_cg_demo_api_key=CG-nMH6hin5tEKHGazYMuDZmdL5`)
    if (!response.ok) {
        throw new Error('Erro ao obter preço da criptomoeda')
    }
    //retorna o preço em BRL
    const data = await response.json() as Record<string, Record<string, number>>
    return data[coinGeckoId].brl
}   

export async function quote(fromToken: string, toToken: string, amount: number) {
    let rate : number = 0
    let toAmount : number = 0
  
    if (fromToken === 'BRL') {
    // Comprando cripto com BRL: preço do toToken em BRL
        rate = await getCryptoPrice(toToken) // ex: 1 BTC = 500.000 BRL
        toAmount = amount / rate
    } else if (toToken === 'BRL') {
    // Vendendo cripto por BRL: preço do fromToken em BRL  
        rate = await getCryptoPrice(fromToken) // ex: 1 BTC = 500.000 BRL
        toAmount = amount * rate
    } else {
    // Cripto para cripto
        const fromPrice = await getCryptoPrice(fromToken)
        const toPrice = await getCryptoPrice(toToken)
        rate = fromPrice / toPrice
        toAmount = amount * rate
    }
    const fee = toAmount * 0.015
    const finalAmount = toAmount - fee
    return { rate, toAmount, fee, finalAmount }

}

export async function executeSwap(fromToken: Token, toToken: Token, amount: number, userId: string) {
    //chama o quote para calcular quanto o usuário vai receber e a taxa    
    const quoteResult = await quote(fromToken, toToken, amount)
    const fee = quoteResult.fee
    const finalAmount = quoteResult.finalAmount
    //busca carteira do usuário
    const wallet = await prisma.wallet.findUnique({ where: { userId } })
    if (!wallet) throw new Error('Carteira não encontrada')
    //verifica se o usuário tem saldo suficiente para fazer a troca
    const saldoFrom = await prisma.walletBalance.findUnique({
    where: { walletId_token: { walletId: wallet.walletId, token: fromToken } }
    })
        if (!saldoFrom || Number(saldoFrom.amount) < amount) {
            throw new Error('Saldo insuficiente')
     }
    //calcula os novos saldos de quanto vai sobrar do fromToken e quanto vai entrar do toToken
    const novoSaldoFrom = Number(saldoFrom.amount) - amount
    const saldoTo = await prisma.walletBalance.findUnique({where: { 
            walletId_token: {
                walletId: wallet.walletId,
                token: toToken
            }
        }
    }) // busca saldo do toToken
    const novoSaldoTo = Number(saldoTo!.amount) + finalAmount
    //atualiza os saldos na carteira do usuário e registra as transações no ledger
    const legder = await prisma.$transaction([
        prisma.walletBalance.update({data: {
            amount: novoSaldoTo
        }, where: {
            walletId_token: {
                walletId: wallet.walletId,
                token: toToken //debita o fromToken 
            }
        }}),
        prisma.walletBalance.update({data: {
            amount: novoSaldoFrom
        }, where: {
            walletId_token: {
                walletId: wallet.walletId,
                token: fromToken //credita o toToken
            }
        }}),
        //registra as transações no ledger: saida, entrada e taxa
            prisma.ledger.create({ data: 
                { userId, 
                    transaction_type: TransactionType.SWAP_OUT, 
                    token: fromToken, 
                    balance_before: saldoFrom!.amount,
                    balance_after: novoSaldoFrom,
                    moved_value: amount 
                } 
            }),
            prisma.ledger.create({ data: 
                { userId,
                    transaction_type: TransactionType.SWAP_IN,
                    token: toToken,
                    balance_before: saldoTo!.amount,
                    balance_after: novoSaldoTo,
                    moved_value: finalAmount 
                } 
            }),
            prisma.ledger.create({ data: 
                { userId,  
                    transaction_type: TransactionType.SWAP_FEE,
                     token: fromToken,
                      balance_before: saldoFrom!.amount,
                       balance_after: novoSaldoFrom,
                        moved_value: fee 
                    }
                }),
    ])
    return legder
}
       
