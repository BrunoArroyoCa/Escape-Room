---
version: 1
slug: "front-src"
primary_target: "front/src"
related_targets: []
---

# Surface: Admin panel (single dashboard)

Mode: Operate. Scope: `front/src` admin panel — one screen that holds the business summary, live games, today's agenda, game history, and in-place editing of rooms, puzzles and bookings.

Audience and task: front-desk staff glance at live rooms and who comes next; the manager reads totals and history and reorganises bookings. Everything opens in context (side sheet), no extra screens. Data is example data from `modelsExample` until the API exists.

## Direction contract

THESIS: The venue drawn as an architectural floor plan — the three rooms are enclosures on one sheet, and the live state of each game is drawn into its room. Refuses the category default of sidebar + KPI cards + card grid of live games.

OWN-WORLD: Drafting-film ground (cool off-white, not cream), iron ink linework at one device pixel, square corners everywhere, graphite for secondary text, one red reserved for markups (alerts, editing, cancellation). Each room owns a zoning colour (teal, ochre, violet) used as a pale tint of its enclosure and as solid fill for solved puzzles. Barlow for UI text, Barlow Condensed for labels and numerals (tabular). Poché (solid ink) only on the plan's outer walls.

STORY: Staff see at once which room is in play, which puzzle each team is on and how much time is left; the manager sees totals, today's sheet of sessions and the history beneath. Clicking a room, a session or a game opens a side sheet to edit the room and its puzzles, reorganise or cancel the booking, or read the game's final score and time.

FIRST VIEWPORT: Top strip as a drawing title block (name, sheet, date, live clock). Below, a ruled band of four figures (games, average score, occupancy today, bookings today). Then the floor plan (about two thirds of the width) with the three rooms side by side, each with team, countdown at large condensed numerals, four puzzle cells and its averages in a small room legend; on the right, today's agenda as a timetable matrix (hours × rooms). The history table starts below the fold with its filters. Primary action: clicking a room/session/game.

FORM: Assigned direction, candidate 5 of my grounded list (architectural plan sheet). seed:b202902b8ebcac11. Signature move: live games drawn as the floor plan, puzzle cells filling with the room's zoning colour by a wipe from the door side when solved; under 10 minutes the room clock gets a red markup ring. Raises: fixed size ramp for scores (star atlas); one-pixel rule discipline and three ink values (reference setting); each figure paired with its proof — clicking a figure filters the history (monochrome product).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
