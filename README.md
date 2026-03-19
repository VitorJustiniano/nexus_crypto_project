# nexus_crypto_project

## Descrição
Nexus Crypto Wallet API
API REST de carteira cripto simplificada desenvolvida como teste prático para a vaga de Desenvolvedor Backend na Nexus.

Tecnologias utilizadas

Node.js + TypeScript
Fastify — framework web
Prisma ORM — acesso ao banco de dados
PostgreSQL (Supabase) — banco de dados
Zod — validação de dados
bcrypt — hash de senhas
JWT — autenticação via access token e refresh token
CoinGecko API — cotações em tempo real

## Como rodar localmente
Pré-requisitos

Node.js 18+
npm
Conta no Supabase (ou PostgreSQL local)

1. Clonar o repositório
git clone https://github.com/VitorJustiniano/nexus-crypto-wallet.git
cd nexus-crypto-wallet

2. Instalar dependências
npm install

3. Configurar variáveis de ambiente
Crie um arquivo .env na raiz do projeto:
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://usuario:senha@host:5432/banco
JWT_SECRET=chave_secreta

4. Rodar as migrations
npx prisma migrate dev

5. Iniciar o servidor
npm run dev

O servidor estará disponível em http://localhost:3000.

Endpoints disponíveis

Metodo          Rota                Auth        Descrição
GET             /health             Não         Check servidor
POST            /auth/register      Não         Cadastra Usuario
POST            /auth/login         Não         Login
GET             /wallet/balances    Sim         Consultar saldos
POST            /webhooks/deposit   Não         Depósito via webhook
GET             /swap/quote         Sim         Cotar um swap
POST            /swap/execute       Sim         Executar um swap
POST            /withdrawal         Sim         Solicitar saque
GET             /ledger             Sim         Extrato de movimentações
GET             /transactions       Sim         Histórico de transações

## Decisões técnicas
Supabase ao invés de PostgreSQL local
Para facilitar o desenvolvimento e já deixar o projeto pronto para deploy. O Supabase oferece PostgreSQL gerenciado gratuitamente com dashboard visual.
Modelo de Ledger
Toda alteração de saldo gera um registro imutável no Ledger com saldo anterior e saldo posterior. Isso garante auditabilidade completa — o saldo atual pode ser reconstruído somando todas as movimentações.
Idempotência no webhook
O endpoint de depósito utiliza idempotencyKey para evitar depósitos duplicados. Cada chave é armazenada no banco e requisições repetidas são rejeitadas.
Transações do Prisma ($transaction)
Todas as operações que envolvem múltiplas escritas no banco (depósito, swap, saque) são executadas dentro de uma $transaction do Prisma, garantindo consistência — ou tudo acontece ou nada acontece.

## Estrutura do banco

model User
    Armazena os dados do usuário. Cada usuário tem uma Wallet associada criada automaticamente no cadastro.
model Wallet
    Pertence a um User (relação 1 para 1). Contém múltiplos WalletBalance.
model WalletBalance
    Armazena o saldo atual de cada token (BRL, BTC, ETH) para uma carteira. A combinação walletId + token é única.
model Ledger
    Registro imutável de cada movimentação de saldo. Tipos: DEPOSIT, SWAP_IN, SWAP_OUT, SWAP_FEE, WITHDRAWAL. Contém saldo anterior e saldo posterior para auditabilidade.
model Transaction
    Agrupa as movimentações em transações completas. Um swap gera 3 entradas no Ledger mas apenas 1 Transaction.
model IdempotencyKey
    Armazena as chaves de idempotência para evitar depósitos duplicados via webhook.

## Estrutura do projeto

prisma
└── schema.prisma
src/
├── config/
│   └── env.ts
├── database/
│   └── prisma.ts
├── generated/
│   └── prisma/
├── middlewares/
│   └── authenticate.ts
├── modules/
│   ├── auth/
│   ├── ledger/
│   ├── swap/
│   ├── transaction/
│   ├── wallet/
│   ├── webhook/
│   └── withdrawal/
├── routes/
│   └── health.routes.ts
├── types/
│   └── fastify.ts
├── app.ts
└── server.ts
