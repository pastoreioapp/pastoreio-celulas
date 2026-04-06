---
name: cloud-agent-starter
description: Minimal Cloud-agent runbook for this repo. Use before making changes so you can install dependencies, start the Next.js app, understand access-code based login, and smoke-test each area.
user-invocable: false
---

# Cloud Agent Starter

Use this skill first when you need to run or test the app in Cursor Cloud.

## Quick start

1. Install dependencies if `node_modules` is missing or stale:

   ```bash
   npm install
   ```

2. Make sure the required Supabase secrets are available to the agent:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - Optional: `NEXT_PUBLIC_SUPABASE_CELULAS_BUCKET` (defaults to `celulas`)

3. If a dev server is already running, reuse it. Otherwise start the server in tmux so the session survives follow-up commands:

   ```bash
   TMUX_BIN="tmux -f /exec-daemon/tmux.portal.conf"; $TMUX_BIN ls >/dev/null 2>&1 || TMUX_BIN="tmux"
   SESSION_NAME="next-dev"; $TMUX_BIN has-session -t "=$SESSION_NAME" 2>/dev/null || $TMUX_BIN new-session -d -s "$SESSION_NAME" -c "$PWD" -- "${SHELL:-bash}" -l
   $TMUX_BIN send-keys -t "$SESSION_NAME:0.0" 'npm run dev' C-m
   $TMUX_BIN capture-pane -pt "$SESSION_NAME:0.0" | tail -n 20
   ```

4. Open `http://127.0.0.1:3000`.

5. Run the two built-in automated checks when your change is not docs-only:

   ```bash
   npm run lint
   npm run build
   ```

There is no `test` script in this repo.

## Critical context before you test

- There is no auth system. "Logging in" means entering a valid access code.
- The root page `/` accepts:
  - a cell code and routes to `/lider/<codigo>`
  - a unidade code and routes to `/unidade/<codigo>`
- Member self-registration lives at `/membro/<codigo>` and also uses a cell access code.
- Invalid codes on the home page show a validation message. Invalid deep links return `404`.
- There are no feature flags or built-in mock modes in the repo. Use real Supabase data.
- Smoke tests need at least one real `celulas.codigo_acesso` and one real `unidades.codigo_acesso`.
- On a fresh Supabase project, run `migrations/1-initial_structure.sql` and then `migrations/2-unidades.sql`, then seed at least one unidade and one celula before testing UI flows.

## Codebase areas and practical test workflows

### 1. Access gate and route resolution

**Where to look**

- `app/page.tsx`
- `components/access/*`
- `lib/routes.ts`
- `lib/rotas.ts`

**Use this flow when**

- changing the landing page
- changing access-code validation or redirects
- changing leader vs unidade routing

**Smoke test**

1. Open `/`.
2. Submit an invalid cell code and confirm the page shows an inline error.
3. Submit an invalid unidade code and confirm the unidade-specific inline error.
4. Submit a valid cell code and confirm the app lands on `/lider/<codigo>`.
5. Submit a valid unidade code and confirm the app lands on `/unidade/<codigo>`.
6. If you already know the access code and are not testing the gate itself, deep-link directly to save time.

### 2. Leader area and member CRUD

**Where to look**

- `app/(lider)/lider/[codigo]/*`
- `components/membros/*`
- `components/insights/*`
- `lib/membros/*`
- `app/actions/membros.ts`

**Use this flow when**

- changing member list UI
- changing member validation, mutations, or server actions
- changing leader insights

**Smoke test**

1. Open `/lider/<CELULA_CODIGO>`.
2. Confirm the leader header, context card, members list, and insights render.
3. Open `/lider/<CELULA_CODIGO>/novo` and create a member with the smallest valid form input.
4. Return to the list and confirm the new member appears.
5. Open `/lider/<CELULA_CODIGO>/membro/<ID>` for that record and verify edit or delete still works.

### 3. Member self-registration

**Where to look**

- `app/membro/[codigo]/page.tsx`
- `components/membros/*`
- `lib/membros/*`
- `app/actions/membros.ts`

**Use this flow when**

- changing the self-registration form
- changing share-link behavior
- changing member creation logic that should work for both leader and self-register flows

**Smoke test**

1. Open `/membro/<CELULA_CODIGO>`.
2. Submit a member through the self-registration form.
3. Open `/lider/<CELULA_CODIGO>` and confirm the new registration is visible in the leader list.

### 4. Unidade area, cell CRUD, and ranking/insights

**Where to look**

- `app/(unidade)/unidade/[codigo]/*`
- `components/celulas/*`
- `components/setores/*`
- `components/insights/*`
- `lib/celulas/*`
- `lib/unidades/*`
- `app/actions/celulas.ts`

**Use this flow when**

- changing unidade dashboards
- changing cell creation or listing
- changing ranking or trajectory insight displays

**Smoke test**

1. Open `/unidade/<UNIDADE_CODIGO>`.
2. Confirm the unidade header, context, insights, and cell list render.
3. If the unidade has child unidades, verify the child tabs/ranking UI still behaves correctly.
4. Open `/unidade/<UNIDADE_CODIGO>/nova-celula` and create a cell.
5. Return to `/unidade/<UNIDADE_CODIGO>` and confirm the new cell appears.

### 5. Shared data and environment setup

**Where to look**

- `lib/supabase/server.ts`
- `lib/constants.ts`
- `lib/trajetoria.ts`
- `lib/types.ts`
- `migrations/*.sql`
- `next.config.ts`

**Use this flow when**

- changing Supabase access
- changing schema assumptions
- changing trajectory-derived counts or insights
- debugging environment-specific failures

**Smoke test**

1. Confirm the required env vars are present before debugging app code.
2. Run `npm run build` after route, server-action, or shared `lib/*` changes.
3. If photos are part of the change, verify `NEXT_PUBLIC_SUPABASE_CELULAS_BUCKET` or the default `celulas` bucket matches the connected project.
4. If the app fails before rendering data, check migrations and seed data before assuming a code regression.

## Common Cloud-agent shortcuts

- Reuse an existing dev server instead of starting duplicates.
- Prefer direct deep links once you know the code:
  - `/lider/<CELULA_CODIGO>`
  - `/unidade/<UNIDADE_CODIGO>`
  - `/membro/<CELULA_CODIGO>`
- For UI changes, do one manual browser smoke test in addition to `lint`/`build`.
- If you need browser automation, use the existing `agent-browser` skill or a `computerUse` subagent.
- Do not spend time hunting for feature flags in this repo; there are none today.

## How to keep this skill useful

Whenever you discover a new setup trick, test shortcut, or debugging runbook detail:

1. Add it to the smallest relevant codebase-area section above.
2. Include the exact command or URL pattern, not a vague description.
3. Note any required seed data, access code, env var, or expected success signal.
4. Delete stale guidance when routes, scripts, env names, or migrations change.
5. Keep this file short; only keep tricks that help the next Cloud agent start faster or validate changes with less guesswork.
