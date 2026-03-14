import { prisma } from '../../database/prisma' 
import bcrypt from 'bcrypt'


export async function register(data: { name: string, email: string, password: string }) {
    if (await prisma.user.findUnique({ where: { email: data.email } })) {
        throw new Error('Email já cadastrado')
    }
    data.password = await bcrypt.hash(data.password, 10)
    return await prisma.user.create({
        omit: { 
            password: true   
        }, 
                data: {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                wallet: {
                    create: {
                        walletBalance: {
                            create: [
                                {token: "BRL", amount: 0 },
                                {token: "BTC", amount: 0 },
                                {token: "ETH", amount: 0 },
                            ]
                        }
                    }
                } 
            }    
        }) 
    }
   

export async function login(data: { email: string, password: string }) {
        const user = await prisma.user.findUnique({ where: { email: data.email } })
        if (!user) {
            throw new Error('Email não cadastrado')
        }
        if (await bcrypt.compare(data.password, user.password)) {
            const { password, ...userWithoutPassword } = user
            return userWithoutPassword
        }       
            throw new Error('Senha incorreta')
    }

