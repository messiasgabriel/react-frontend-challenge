# CineDash - Decisões de Arquitetura

## Estrutura: Feature-Sliced Design (FSD)

Adotamos FSD para organizar o código em camadas com responsabilidades bem definidas:

```
src/
├── app/        → Providers, layouts, configuração global
├── routes/     → Rotas (TanStack Router file-based)
├── features/   → Lógica de negócio por funcionalidade
├── entities/   → Tipos e API de domínio
├── shared/     → UI (shadcn), utilitários, hooks, config
└── tests/      → Suite de testes (unitários + integração)
```

**Por que FSD?** Garante separação entre UI, lógica e dados. Cada feature é isolada com seu store, schema e componentes — evitando prop drilling e acoplamento entre domínios.

**Reconciliação com TanStack Router:** O TanStack Router exige que rotas fiquem em `src/routes/`. Os arquivos de rota são mantidos finos — apenas definem a rota e delegam para componentes de `features/` e `entities/`.

**Desvios conhecidos (rastreados para refatoração):**
- `components/ui/` deveria ser `shared/ui/` (caminho de output do shadcn, configurado em `components.json`)
- Lógica do reset de página no `dashboard.tsx` poderia mover para uma feature, mas a complexidade não justifica no momento

## Gestão de Estado

| Tipo de dado | Ferramenta | Motivo |
|---|---|---|
| Dados do servidor (filmes, gêneros) | TanStack Query | Cache automático, background refetch, stale-while-revalidate |
| Autenticação | Zustand (sem persist) | Token vive no cookie — a persistência é via cookie, não localStorage |
| Watchlist | Zustand + persist | Dados puramente client-side, sem backend |
| Tema dark/light | Zustand + persist | Preferência do usuário persistida em localStorage |
| Busca e filtros | Zustand (efêmero) | UI state que não precisa sobreviver ao reload |
| Página atual | URL search params | Bookmarkable e compartilhável via TanStack Router |

**Por que não usar TanStack Query para tudo?** Watchlist e tema são dados locais — não fazem chamadas de API. Zustand é mais apropriado para client state.

## Autenticação Simulada

Sem backend real, a autenticação é simulada no front-end:

1. **Validação** via Zod (`loginSchema`): e-mail válido + senha com no mínimo 6 caracteres
2. **JWT** gerado com `jose` (HS256), contendo `email`, `name`, `sub`, `iss: 'cinedash'`, `aud: 'cinedash-app'` e expiração de 24h. O secret é lido de `VITE_JWT_SECRET` via `env.JWT_SECRET` — obrigatório, a aplicação lança erro na inicialização se ausente
3. **Armazenamento** em cookie (`cinedash-token`) com `max-age` de 24h — não localStorage
4. **Persistência de sessão**: ao recarregar, o cookie é lido e o JWT verificado com `jwtVerify()`. Se válido (issuer, audience e expiração corretos), o usuário é rehidratado sem novo login
5. **Route guard** via `beforeLoad` do TanStack Router: redireciona para `/login` se a sessão for inválida

**Por que cookie e não localStorage?** Cookies expiram automaticamente, são mais adequados para tokens de sessão, e o `beforeLoad` do TanStack Router lê o estado de forma síncrona via `getState()` sem precisar de contexto React.

## API Layer (TMDB)

- **`tmdbFetch<T>`**: Wrapper genérico sobre `fetch` com Bearer token, parâmetro `language=pt-BR` em todas as chamadas e tratamento de erros via `ApiError`
- **Query key factory** (`movieKeys`): Chaves hierárquicas para cache consistente e invalidação precisa
- **`queryOptions()` factories**: Cada endpoint tem `staleTime` configurado individualmente (5min para trending/discover, 2min para search, `Infinity` para gêneros)
- **`placeholderData: keepPreviousData`**: Evita flash de conteúdo vazio ao paginar
- **3 queries paralelas no dashboard**: `trending`, `search` e `discover` rodam simultaneamente com flag `enabled`. Um ponteiro `activeResult` seleciona qual resultado expor com base no estado atual de busca e filtros

## Desafios com a API do TMDB

### Rate limits
Digitação rápida geraria uma requisição por tecla pressionada, esgotando rapidamente o limite.

**Solução:** `useDebounce(query, 300)` aguarda 300ms de inatividade antes de disparar a busca.

### Limite de 500 páginas
O TMDB retorna erro ao solicitar páginas além de 500.

**Solução:** `AdvancedPagination` aplica `Math.min(totalPages, 500)` — o botão "Última" nunca ultrapassa a página 500.

### URLs de imagem
Imagens do TMDB não são URLs diretas — exigem base URL + prefixo de tamanho.

**Solução:** `getImageUrl(path, size)` centraliza a construção da URL e retorna um placeholder quando `path` é `null`.

## Testes

- **Vitest** + **React Testing Library** + **jsdom**
- **Testes unitários:** schemas Zod, stores Zustand, hooks (`useDebounce`, `useMoviesQuery`), JWT (`fake-auth`), utilitários
- **Testes de integração:** fluxo da watchlist (toggle → store → tabela) e fluxo dos filtros (input → validação → store)
- **Ambiente `node`** para testes de `jose`: a biblioteca usa Web Crypto API, incompatível com jsdom

**Descoberta relevante:** `userEvent.click` falha em botões dentro de tabelas TanStack Table quando uma React Query no mesmo componente resolve entre os eventos de ponteiro e o clique final, substituindo o nó DOM. `fireEvent.click` é a abordagem correta nesse cenário.

## Decisões Técnicas

| Decisão | Alternativa considerada | Motivo |
|---|---|---|
| `fetch` nativo | Axios | Menos dependência, API moderna, suficiente para requisições GET |
| Zustand | Context API | Menos boilerplate, middleware `persist`, acesso fora do React via `getState()` |
| File-based routing | Rotas manuais | Code-splitting automático, type-safety end-to-end, melhor DX |
| shadcn/ui | Material UI, Radix direto | Componentes headless copy-paste com total controle de estilo |
| `jose` | `jsonwebtoken` | Suporte nativo a Web Crypto API, ESM puro, mais moderno |
| TanStack Table | tabela manual | Ordenação, paginação e acessibilidade prontos sem reimplementar |
