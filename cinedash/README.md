# CineDash

Dashboard de curadoria e descoberta de filmes utilizando a API do TMDB.

## Stack

- React 19 + TypeScript 5.9
- Vite 8 + TanStack Router (file-based routing)
- TanStack Query (data fetching e cache)
- TanStack Table (tabela ordenável da watchlist)
- Zustand (gerenciamento de estado)
- Tailwind CSS v4 + shadcn/ui
- React Hook Form + Zod (validação)
- Jose (JWT simulado)
- Vitest + React Testing Library

## Funcionalidades

- Login simulado com JWT (jose) e persistência via cookie
- Dashboard com busca (debounce 300ms), filtros (gênero, ano, nota) e paginação
- Três queries paralelas: trending, busca e discover com troca dinâmica
- Detalhes do filme: sinopse, elenco, trailer, orçamento e links externos
- Watchlist com tabela ordenável e persistência em localStorage
- Tema dark/light persistido
- Arquitetura Feature-Sliced Design (FSD)
- 110 testes unitários e de integração

## Como rodar

Veja [INSTRUCTIONS.md](./INSTRUCTIONS.md) para instruções detalhadas.

```bash
npm install
cp .env.example .env  # Configure VITE_TMDB_ACCESS_TOKEN e VITE_JWT_SECRET
npm run dev
```

## Decisões técnicas

Veja [ARCHITECTURE.md](./ARCHITECTURE.md) para a documentação completa das decisões de arquitetura.
