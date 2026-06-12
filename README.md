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