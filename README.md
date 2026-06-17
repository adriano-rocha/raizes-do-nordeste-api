# Raízes do Nordeste API

API REST para rede de lanchonetes Raízes do Nordeste, desenvolvida com Node.js, Express, Prisma e PostgreSQL.

## Requisitos

- Node.js v18+
- PostgreSQL v14+
- npm v9+

## Tecnologias

- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT (jsonwebtoken)
- bcryptjs
- Swagger/OpenAPI
- Zod

## Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/adriano-rocha/raizes-do-nordeste-api.git
cd raizes-do-nordeste-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha com seus dados:

```bash
cp .env.example .env
```

Conteúdo do `.env`:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/raizes_nordeste"
JWT_SECRET="raizes_nordeste_secret_2026"
PORT=3000
```

### 4. Crie o banco de dados

```bash
psql -U postgres -c "CREATE DATABASE raizes_nordeste;"
```

### 5. Execute as migrations

```bash
npx prisma migrate dev
```

### 6. Inicie a API

```bash
npm run dev
```

### 7. Acesse a documentação

[http://localhost:3000/docs](https://raizes-do-nordeste-api-production.up.railway.app/docs)

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /auth/register | Cadastrar usuário |
| POST | /auth/login | Login |
| GET | /unidades | Listar unidades |
| POST | /unidades | Criar unidade |
| GET | /produtos | Listar produtos |
| POST | /produtos | Criar produto |
| GET | /estoque/:unidadeId | Consultar estoque |
| POST | /estoque | Entrada de estoque |
| POST | /pedidos | Criar pedido |
| GET | /pedidos | Listar pedidos |
| PATCH | /pedidos/:id/status | Atualizar status |
| POST | /pagamentos | Processar pagamento mock |
| GET | /fidelidade | Consultar pontos |
| POST | /fidelidade/adicionar | Adicionar pontos |
| POST | /fidelidade/resgatar | Resgatar pontos |

## Fluxo principal

1. Cadastrar usuário (`POST /auth/register`)
2. Fazer login (`POST /auth/login`) — guardar o token
3. Criar unidade (`POST /unidades`)
4. Criar produto (`POST /produtos`)
5. Adicionar estoque (`POST /estoque`)
6. Criar pedido (`POST /pedidos`)
7. Processar pagamento (`POST /pagamentos`)
8. Atualizar status (`PATCH /pedidos/:id/status`)

## Coleção Postman

Arquivo disponível em: `postman/raizes-do-nordeste.json`

## Links

- **Repositório:** https://github.com/adriano-rocha/raizes-do-nordeste-api
- **API em produção:** https://raizes-do-nordeste-api-production.up.railway.app
- **Swagger:** https://raizes-do-nordeste-api-production.up.railway.app/docs
- **Coleção Postman:** `/postman/raizes-do-nordeste.json`
