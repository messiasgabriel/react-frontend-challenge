# CineDash - Instruções

## Pré-requisitos

- Node.js >= 18
- npm >= 9

## Instalação

```bash
git clone <repo-url>
cd react-frontend-challenge/cinedash
npm install
```

## Configuração

Crie o arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o `.env`:

```env
VITE_TMDB_ACCESS_TOKEN=<seu_token_de_acesso_TMDB>
VITE_JWT_SECRET=<qualquer_string_com_32+_caracteres>
```

### Obtendo o token TMDB

1. Crie uma conta em [themoviedb.org](https://www.themoviedb.org/signup)
2. Acesse [Settings > API](https://www.themoviedb.org/settings/api)
3. Copie o **API Read Access Token** (começa com `eyJ...`)

> Use o **Read Access Token (v4 auth)**, não a API Key.

## Execução

```bash
npm run dev       # Servidor de desenvolvimento (http://localhost:5173)
npm run build     # Build de produção
npm run preview   # Preview do build
```

> **Atenção:** acesse sempre via `http://localhost:5173`, nunca pelo IP da máquina (ex: `192.168.x.x`). O login utiliza `crypto.subtle` (Web Crypto API), que só está disponível em contextos seguros — HTTPS ou `localhost` especificamente. Acessar via IP em HTTP resultará em erro ao tentar autenticar.

## Testes

```bash
npx vitest run    # Execução única (82 testes em 11 arquivos)
npx vitest        # Modo watch
npx vitest --ui   # Interface visual
```

## Login

A autenticação é simulada no front-end — não há backend real. Use qualquer e-mail válido e senha com no mínimo 6 caracteres para entrar. A sessão persiste por 24 horas via cookie e é restaurada automaticamente ao recarregar a página.

## Projeto Escolhido

**CineDash** — Dashboard de curadoria e descoberta de filmes utilizando a API do TMDB.

Funcionalidades principais:
- Filmes em alta com busca, filtros por gênero/ano/nota e paginação
- Página de detalhes com elenco, trailer, orçamento e links externos
- Watchlist pessoal com tabela ordenável e persistência em `localStorage`
- Alternância de tema claro/escuro
