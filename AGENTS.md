# AGENTS.md

Repo is pre-code apart from a static prototype. There is no backend source, manifest, lockfile, CI, or test runner yet. Do not invent build/test/lint commands.

- Prototype entrypoint: `index.html` (single self-contained file, no build step — open directly in a browser).

## Source of truth

- `doc/Software_Requirements_Specification.pdf` defines scope and intended stack. `README.md` is empty; `doc/scrum/` holds (currently empty) sprint notes.
- If docs conflict with future code/config, trust the executable source and update this file.

## Intended architecture (per SRS, not yet implemented)

- Management backend + dashboard: TypeScript with Bun, Hono, React, PostgreSQL, Drizzle ORM. Handles auth (Admin/Player), room listing, reservations, live-game tracking, scores.
- Game client: Unity (C#), 2D point-and-click. Talks to backend via REST (session tokens, scores, hints). No Unity project in repo yet.
- When code lands, expect two boundaries (`backend/` + `client/` or similar). Update this file with real entrypoints and commands at that point.

## Constraints an agent would otherwise miss

- Backend must track up to 3 concurrent live rooms without degradation; game start must load in <5s from click.
- Unity client target is 60 FPS minimum.
- Roles: Player (browse rooms, book with team members, play, hint, early exit) vs Admin (dashboard with business data, live progress/scores, room/puzzle details, manage/cancel bookings).
