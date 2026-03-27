<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Context

## Product Goal
- Mobile-first CRUD for mapping members of church cell groups (`celulas`).
- Flows: access code gate on `/`, leader area on `/lider/[codigo]` (list, create, edit), and member self-registration on `/membro/[codigo]`.
- Prioritize simplicity, clear visual hierarchy, large touch targets, and accessible contrast.

## Stack
- Next.js 16 App Router, React 19, TypeScript.
- Tailwind CSS v4.
- Supabase (server-side only, no auth layer yet).

## Architecture

### Routes (`app/`)
| Route | Purpose |
|-------|---------|
| `app/page.tsx` | Access code gate → redirects to `/lider/[codigo]` |
| `app/(lider)/lider/[codigo]/layout.tsx` | Shared leader header and cell context card |
| `app/(lider)/lider/[codigo]/page.tsx` | Member list |
| `app/(lider)/lider/[codigo]/novo/page.tsx` | Create member |
| `app/(lider)/lider/[codigo]/membro/[id]/page.tsx` | Edit member |
| `app/membro/[codigo]/page.tsx` | Self-registration (shared via link) |
| `app/actions/membros.ts` | Server actions (orchestration only) |

### Domain layer (`lib/mapeamento/`)
| File | Role |
|------|------|
| `trajetoria.ts` | Single source of truth for trajectory steps, categories, totals |
| `constants.ts` | Schema name, table names, `MEMBER_FORM_FIELDS` |
| `types.ts` | Domain types, form state contracts |
| `routes.ts` | URL builder helpers (no hardcoded paths elsewhere) |
| `formatting.ts` | Shared phone/date formatters |
| `celulas.ts` | Cell loading, access code resolution via DB |
| `membros.ts` | Member validation, persistence, queries |
| `rotas.ts` | Route-level access resolution with `React.cache` |

### UI (`components/membros/`)
Form, list, selectors, trajectory sections. Client Components only import from client-safe modules (`trajetoria`, `constants`, `types`, `routes`, `formatting`).

### Supabase (`lib/supabase/server.ts`)
Server-only client. All DB access flows through `lib/mapeamento/*`.

## Data Model
- Schema: `mapeamento`
- `celulas`: `id`, `nome`, `setor`, `lideres`, `dia_semana`, `horario`, `foto_url`, `codigo_acesso`
- `membros`: `id`, `celula_id`, `nome`, `estado_civil`, `telefone`, `data_nascimento`, `discipulador_nome`, `ministerios`, `passos_concluidos`, `created_at`
- `passos_concluidos` is `TEXT[]` aligned with `PassoTrajetoria` enum values in `lib/mapeamento/trajetoria.ts`.
- `codigo_acesso` on `celulas` holds the normalized access code (e.g., `CEL1001`).

## Key Invariants
- `app/` stays thin: data access and validation live in `lib/mapeamento/*`.
- Domain types live in `lib/mapeamento/`, never in `app/` or `components/`.
- Use `MEMBER_FORM_FIELDS` for HTML `name` attributes — never hardcode field names.
- Derive trajectory counts and labels from `lib/mapeamento/trajetoria.ts` — never hardcode `19`, `4`, or step strings.
- Use `lib/mapeamento/formatting.ts` — never define local formatters.
- Use `lib/mapeamento/routes.ts` for URL building — never assemble paths manually.
- Supabase queries use `MAPEAMENTO_SCHEMA` and `MAPEAMENTO_TABLES` from `constants.ts`.
- Files marked `import "server-only"` (`celulas.ts`, `membros.ts`, `rotas.ts`, `lib/supabase/server.ts`) must never be imported from `"use client"` components.

## When Updating This App
- **Trajectory changes** → update `lib/mapeamento/trajetoria.ts` first; UI and validation derive from it.
- **Form field changes** → update `MEMBER_FORM_FIELDS` in `constants.ts`, `types.ts`, and validation in `membros.ts` together.
- **Schema changes** → add a migration in `migrations/`, then update types, column selects, validation, and mappers in `lib/mapeamento/*`.
- **Access code changes** → update `celulas.codigo_acesso` via migration or admin tool.

## Dev & CI
- **Package manager:** npm (`package-lock.json`).
- **Dev server:** `npm run dev` (port 3000).
- **Lint:** `npm run lint` (ESLint, currently clean).
- **Build:** `npm run build`.
- **Tests:** none configured.
- **Env vars:** `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (set as Cursor secrets).
- **Migration required:** `migrations/fourth_celula_codigo_acesso.sql` must run in Supabase for access codes to work.

## Contextual Rules
File-specific rules for the Cursor editor live in `.cursor/rules/*.mdc`. They are auto-injected when matching files are open.
