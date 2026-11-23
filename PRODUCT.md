# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Two audiences share one admin panel:
- **Front-desk staff** at the venue, watching the three rooms live while attending groups; they glance at the panel and act fast (who is playing, how far, how much time is left, who arrives next).
- **Owner / manager** reviewing the business from a desk: totals, average scores, occupancy, history, and reorganising bookings.

Players use a separate surface (booking web + Unity game client); they are not users of this panel.

## Product Purpose
A management system for an escape-room venue with three rooms. The admin panel lets the business see its numbers, follow games in progress (progress and score), consult finished games, and manage rooms and bookings. Success: staff can see the state of the venue and act on it without hunting through screens.

## Positioning
The game client (Unity, 2D point-and-click) and the panel share one backend, so games, scores and bookings appear in the panel as they happen in the room — live progress per puzzle, not just a booking calendar.

## Operating Context
- Exactly 3 rooms, each with 4 puzzles (index 1–4) with message, solution and hint; sessions are booked by time slot.
- Games have status in progress / completed / abandoned, a score, a progress value and start/end time.
- Live view: SSE or polling every few seconds is acceptable (only 3 rooms).
- Academic software-engineering project (Scrum sprints); SRS in `doc/`.

## Capabilities and Constraints
- Stack: Bun + Express + Drizzle + PostgreSQL backend (`back/`), React 19 + Vite + TypeScript front (`front/`), Base UI for components, Motion for animation.
- Admin API (planned): `/admin/dashboard`, `/admin/games` (status/map/date filters, detail, live), `/admin/maps` (CRUD + puzzles), `/admin/reservations` (filters, reorganise, cancel), optional `/admin/users`.
- The backend is not ready: the front uses example data in `front/src/modelsExample/` and must not call any API yet. Front work must not modify `back/`.
- The user wants **fewer screens**: dashboard and games features live together in one dashboard, and items are edited by clicking them in place rather than navigating away.

## Brand Commitments
Name in use: "Escape Room". Interface language: Spanish. The earlier `doc/prototype` look is explicitly **not** binding.

## Evidence on Hand
No real business data yet; all figures in the panel are example data and must be presented as such. No logo or brand assets exist.

## Product Principles
1. One place: the state of the venue is readable on a single screen; detail and editing open in context.
2. Live first: what is happening in the rooms right now outranks history.
3. Honest numbers: never show fabricated precision or claims beyond the data.
4. Fast action for staff, depth on demand for the manager.
