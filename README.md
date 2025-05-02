# 📚 Books API (NestJS + Prisma)

Uma API RESTful para gerenciamento de livros e autores, construída com NestJS, Prisma ORM e com observabilidade integrada (Prometheus e Pino).

---

## 🚀 Tecnologias utilizadas

- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [SQLite](https://www.sqlite.org/) (ou adaptável para PostgreSQL)
- [Prometheus](https://prometheus.io/)
- [nestjs-pino](https://github.com/iamolegga/nestjs-pino)
- [Jest](https://jestjs.io/) (testes unitários)

---

## 📂 Estrutura do projeto

```
src/
├── modules/
│   ├── books/
│   └── authors/
├── prisma/
│   └── schema.prisma
├── metrics/
├── health/
└── main.ts
```

---

## 📚 Endpoints: Books

| Método | Rota           | Descrição                             |
|--------|----------------|----------------------------------------|
| GET    | `/books`       | Lista livros em estoque (paginado)     |
| GET    | `/books/search`| Busca livros por nome/descrição        |
| GET    | `/books/:id`   | Detalhes de um livro específico        |
| POST   | `/books`       | Cria um novo livro                     |
| PUT    | `/books/:id`   | Atualiza um livro (exceto SBN)         |
| DELETE | `/books/:id`   | Exclui um livro                        |

---

## 🧑‍🏫 Endpoints: Authors

| Método | Rota           | Descrição                             |
|--------|----------------|----------------------------------------|
| GET    | `/authors`     | Lista todos os autores                 |
| GET    | `/authors/:id` | Retorna um autor específico            |
| POST   | `/authors`     | Cria um novo autor com info opcional   |
| PUT    | `/authors/:id` | Atualiza nome e/ou info do autor       |
| DELETE | `/authors/:id` | Exclui um autor                        |

---

## 🧪 Exemplos de requisição `curl`

### Criar autor

```bash
curl -X POST http://localhost:3000/authors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Robert C. Martin",
    "authorInfo": {
      "bio": "Autor de Clean Code",
      "birthdate": "1952-12-05T00:00:00Z"
    }
  }'
```

### Criar livro

```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{
    "sbn": "9780132350884",
    "name": "Clean Code",
    "short_description": "Um guia de boas práticas",
    "stock": 10,
    "author_id": 1
  }'
```

---

## 📈 Observabilidade

### 🔹 Logs estruturados

- Usando `nestjs-pino`
- Visualização de requisições no terminal com request ID, tempo de resposta, rota, método.

### 🔹 Métricas Prometheus

- Acesse: `http://localhost:3000/metrics`
- Exemplo:

```
# HELP books_requests_total Contador de requisições para livros
# TYPE books_requests_total counter
books_requests_total{method="GET",route="/books"} 3
```

Métricas implementadas:

- `books_requests_total`
- `authors_requests_total`

### 🔹 Health Check

- Endpoint: `GET /health`
- Verifica ping externo (pode ser adaptado para DB, Redis, etc.)

---

## ✅ Testes

- Rodar testes unitários com Jest:

```bash
yarn test
```

Cobertura de testes:

- `BooksRepository`
- `BooksService`
- `AuthorsRepository`
- `AuthorsService`

---

## 🛠️ Setup e inicialização

1. Instale dependências:

```bash
yarn install
```

2. Gere o client Prisma:

```bash
npx prisma generate
```

3. Suba o banco com schema:

```bash
npx prisma db push
```

4. Inicie o servidor:

```bash
yarn start:dev
```

---

## 🧠 Observações finais

- O campo `sbn` no livro não pode ser alterado
- `short_description` e `authorInfo` são opcionais
- Requisições inválidas são tratadas com validação via `class-validator`
- Os testes utilizam `jest.fn()` e `Mocked<PrismaService>` para garantir isolamento

---

Feito com ❤️ usando NestJS.