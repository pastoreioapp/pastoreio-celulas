<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Context

## Product Goal
- This app is a mobile-first CRUD for mapping members of church cell groups (`celulas`).
- Flows: access code gate on `/`, leader area on `/lider/[codigo]` (list, create, edit), and member self-registration on `/membro/[codigo]`.
- Prioritize simplicity, clear visual hierarchy, large touch targets, and accessible contrast.

## Current Stack
- Next.js 16 App Router with React 19 and TypeScript.
- Tailwind CSS v4 for styling.
- Supabase JavaScript client for database access.
- No authentication layer yet; current Supabase access is server-side only.

## Current Architecture
- `app/page.tsx`: access code gate that redirects to `/lider/[codigo]`.
- `app/(lider)/lider/[codigo]/layout.tsx`: shared layout for the leader area (header, cell context card).
- `app/(lider)/lider/[codigo]/page.tsx`: member list.
- `app/(lider)/lider/[codigo]/novo/page.tsx`: create member.
- `app/(lider)/lider/[codigo]/membro/[id]/page.tsx`: edit member.
- `app/membro/[codigo]/page.tsx`: member self-registration (shared via link).
- `app/actions/membros.ts`: server action orchestration only.
- `components/membros/*`: UI components (form, list, selectors, trajectory sections).
- `lib/mapeamento/trajetoria.ts`: single source of truth for trajectory categories, labels, and totals. `app/types/trajetoria.ts` re-exports from here.
- `lib/mapeamento/celulas.ts`: cell loading, access code resolution via DB (`loadCelulaByAccessCode`).
- `lib/mapeamento/membros.ts`: member validation, persistence, and queries.
- `lib/mapeamento/formatting.ts`: shared formatting helpers (phone, dates).
- `lib/mapeamento/rotas.ts`: route-level access resolution with `React.cache`.
- `lib/mapeamento/routes.ts`: URL builder helpers.
- `lib/mapeamento/constants.ts`: schema, table, and form field constants.
- `lib/mapeamento/types.ts`: domain types and form state contracts.
- `lib/supabase/server.ts`: server-only Supabase client/config access.

## Data Model
- Schema: `mapeamento`
- Tables:
  - `celulas`: `id`, `nome`, `setor`, `lideres`, `dia_semana`, `horario`, `foto_url`, `codigo_acesso`
  - `membros`: `id`, `celula_id`, `nome`, `estado_civil`, `telefone`, `data_nascimento`, `discipulador_nome`, `ministerios`, `passos_concluidos`, `created_at`
- `passos_concluidos` is stored as `TEXT[]` and must stay aligned with the labels in `lib/mapeamento/trajetoria.ts`.
- `codigo_acesso` on `celulas` holds the normalized access code for leader access (e.g., `CEL1001`).

## Important Conventions
- Keep `app` thin. Prefer putting data access and validation in `lib/mapeamento/*`.
- Do not make route files depend on component-owned types.
- Domain types and trajectory definitions live in `lib/mapeamento/`, not in `app/`. The `app/types/trajetoria.ts` file is a thin re-export for backward compatibility.
- Reuse `MEMBER_FORM_FIELDS` from `lib/mapeamento/constants.ts` instead of hardcoding form field names.
- Reuse totals and category metadata from `lib/mapeamento/trajetoria.ts` instead of hardcoding counts like `19` or `4`.
- Reuse formatters from `lib/mapeamento/formatting.ts` instead of defining local copies in components.
- Prefer extending the existing `lib/mapeamento` layer for future flows instead of querying Supabase directly from routes/components.

## Supabase Notes
- Required env vars: `NEXT_PUBLIC_SUPABASE_URL` and either `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Access codes are stored in `celulas.codigo_acesso` (normalized form). Resolution goes through `loadCelulaByAccessCode()`.
- Loading cells currently goes through `loadCelulaOptions()` (all) or `loadCelulaOptionById()` (single).
- Member creation goes through async validation in `validateCreateMemberFormData()` and persistence in `createMember()`.

## When Updating This App
- If the trajectory changes, update `lib/mapeamento/trajetoria.ts` first and let UI/validation derive from it.
- If form fields change, update `lib/mapeamento/constants.ts` and the server validation flow together.
- If the database schema changes, review `migrations/*.sql` and `lib/mapeamento/*` in the same task.
- If access codes change, update `celulas.codigo_acesso` in the database via migration or admin tool.

## Cursor Cloud specific instructions

- **Package manager:** npm (lockfile is `package-lock.json`).
- **Dev server:** `npm run dev` starts Next.js on port 3000.
- **Lint:** `npm run lint` runs ESLint. Currently passes clean.
- **Build:** `npm run build` produces a production build.
- **No test framework** is configured; there are no automated tests to run.
- **Supabase env vars** (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) must be set as Cursor secrets. The app gracefully shows a config error message if they are missing, but forms won't submit.
- **Migration required:** Run `migrations/fourth_celula_codigo_acesso.sql` in Supabase to populate access codes in the `celulas` table. Without this migration, access code resolution will not work.
- The "hello world" task is: enter an access code on `/`, get redirected to the leader area, view members, and create/edit a member.
