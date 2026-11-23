---
name: Escape Room
description: Admin panel for a three-room escape-room venue, drawn as an architectural floor plan on drafting film.
colors:
  drafting-film: "#F2F3F0"
  sheet: "#FBFBF9"
  iron-ink: "#1B1F24"
  graphite: "#62676E"
  rule: "#C9CBC6"
  markup-red: "#C8322A"
  zone-teal: "#00836E"
  zone-ochre: "#9E640C"
  zone-violet: "#6E52A0"
  zone-extra: "#4F555C"
typography:
  display:
    fontFamily: "Barlow Condensed, Barlow, system-ui, sans-serif"
    fontSize: "clamp(44px, 4.4vw, 64px)"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
  headline:
    fontFamily: "Barlow Condensed, Barlow, system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
  title:
    fontFamily: "Barlow Condensed, Barlow, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.1
  section-title:
    fontFamily: "Barlow Condensed, Barlow, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.02em"
  body:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: "tnum"
  body-sm:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Barlow Condensed, Barlow, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.06em"
  button:
    fontFamily: "Barlow Condensed, Barlow, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.05em"
rounded:
  none: "0px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "24px"
  "6": "32px"
  "7": "48px"
components:
  button-solid:
    backgroundColor: "{colors.iron-ink}"
    textColor: "{colors.drafting-film}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "36px"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.iron-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "36px"
  button-line-hover:
    backgroundColor: "{colors.iron-ink}"
    textColor: "{colors.drafting-film}"
  button-markup:
    backgroundColor: "transparent"
    textColor: "{colors.markup-red}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "36px"
  button-markup-hover:
    backgroundColor: "{colors.markup-red}"
    textColor: "{colors.sheet}"
  input:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.iron-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
    height: "36px"
  segmented-item:
    backgroundColor: "transparent"
    textColor: "{colors.iron-ink}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "34px"
  segmented-item-pressed:
    backgroundColor: "{colors.iron-ink}"
    textColor: "{colors.drafting-film}"
  room-tag:
    backgroundColor: "{colors.zone-teal}"
    textColor: "{colors.sheet}"
    rounded: "{rounded.none}"
    padding: "0 4px"
    height: "24px"
  puzzle-cell-solved:
    backgroundColor: "{colors.zone-teal}"
    textColor: "{colors.sheet}"
    rounded: "{rounded.none}"
    padding: "0 8px"
    height: "44px"
---

# Design System: Escape Room

## Overview

**Creative North Star: "The Plan Sheet"**

The panel is a single architectural drawing of the venue. The three rooms are enclosures on one sheet of drafting film, walled in solid ink, separated by double-line partitions, each with a door swing cut into its bottom wall; the live state of each game is drawn inside its room. Everything around the plan is a part of the same drawing set: a title block across the top (name, drawing title, sheet number, date, live clock), a ruled band of figures, a timetable matrix for today's agenda, and a ruled schedule (the history table) below. Editing happens on a side sheet laid over the drawing, never on another page.

The material is paper and ink: a cool off-white ground (never cream), iron-ink linework at one device pixel, square corners everywhere, graphite for secondary text and one red reserved for markups. Colour beyond that comes only from the three room zoning colours, which tint each enclosure faintly and fill solid where something is done or happening. Density is that of a working drawing: compact, ruled, legible at a glance from the front desk, with depth one click away.

The colour values live in one place: `front/src/config/theme.ts`. `ThemeProvider` writes each key to a CSS custom property on `:root` at boot (`graphite` becomes `--graphite`, `zones[i]` becomes `--zone-{i+1}`); `front/src/styles/global.css` only carries fallback copies of the same values. To change a colour, edit `theme.ts` and nothing else.

**Key Characteristics:**
- One sheet: the floor plan, agenda, figures and history read as a single drawing set, not a grid of cards.
- One-pixel ink rules as the primary structure; solid ink (poché) only on the plan's outer walls.
- Square corners on every element, without exception.
- Three ink values (ink, graphite, rule) plus one markup red; zoning colour is the only other hue.
- Condensed, tabular numerals for every figure, clock and score.
- Example data is flagged in red ("Ejemplo", "De ejemplo") until the API is connected.

## Colors

A monochrome drafting palette (film, ink, graphite, rule) with one red for markups and three zoning colours that belong to the rooms, not to the interface.

### Primary
- **Iron Ink** (`iron-ink`): the drawing itself. Body text, every 1px rule (`--hair`), the 6px outer walls of the plan, solid buttons, pressed segments, open select triggers, highlighted options, text selection and toasts.

### Secondary
- **Markup Red** (`markup-red`): the reviewer's red pen. Alerts, cancellation and destructive actions, the urgent clock ring under 10 minutes, the "now" line in the agenda, abandoned results, "Ejemplo" flags, changed-field markers, invalid inputs, and the keyboard focus ring.

### Tertiary (room zoning)
- **Zone Teal** (`zone-teal`), **Zone Ochre** (`zone-ochre`), **Zone Violet** (`zone-violet`): one per room, in room order (`zones` in `theme.ts`). Each room's colour is passed down as a local `--zone` variable and used as: a 6% tint of its enclosure, the solid fill of its room tag and solved puzzle cells, the solid fill of a live session in the agenda, a hatched fill for the current puzzle and pending sessions, the 9 to 10px swatch beside its name anywhere it is referenced, and its score ramp in the history table. Text on a solid zone fill is always `sheet`.

### Neutral
- **Drafting Film** (`drafting-film`): the page ground behind the drawing; also the text colour on ink fills.
- **Sheet** (`sheet`): raised paper. The title block, figures band, plan interior, agenda, history, side sheet, inputs and popups.
- **Graphite** (`graphite`): secondary text, column headers, labels, notes, idle room state, the dashed door swing.
- **Rule** (`rule`): soft separators (`--hair-soft`) inside tables and legends, and the diagonal hatch of a closed room.

### Named Rules
**The Red Pen Rule.** Markup red appears only where something needs attention or would be undone: alert, urgency, cancellation, abandonment, invalid input, focus, example-data flags. It is never decoration, never a brand accent, never a hover colour for neutral actions.

**The Zones Belong to Rooms Rule.** A zoning colour may only appear in connection with its own room. No zone colour is used for generic UI state, charts unrelated to a room, or emphasis. When `theme.ts` zones change, keep text on them at 4.5:1 or better with `sheet` and keep the three clearly distinct.

- **Zone Extra** (`zone-extra`, `extraZone` in `theme.ts`): rooms 4 and later (rooms can be created from the panel). No fourth hue passed all-pairs colour-blind separation against the three zones, so extra rooms take this neutral graphite and are identified by their boxed room number, never by colour alone. A room's number (and so its colour) is fixed when it is created and never reused or shifted when another room is deleted.

**The One Source Rule.** Colours are edited in `front/src/config/theme.ts` only. Components reference the CSS variables (`var(--ink)`, `var(--zone)`), never literal hex values; the only literal colour in component CSS is `rgb(27 31 36 / alpha)` for overlay shadows and the backdrop scrim.

## Typography

**Display Font:** Barlow Condensed (with Barlow, system-ui, sans-serif)
**Body Font:** Barlow (with system-ui, sans-serif)

Both are self-hosted woff2 in `front/src/assets/fonts`, declared in `front/src/styles/fonts.css` (Barlow 400/500/600; Barlow Condensed 500/600/700).

**Character:** Barlow reads like the lettering on a technical drawing: plain, open and slightly engineered. Its condensed cut carries every label, title and number, so the plan's figures stack tightly and the clocks can be very large without crowding the room.

### Hierarchy
- **Display** (Condensed 700, clamp(44px, 4.4vw, 64px), 0.9): the countdown clock in each live room. The game score on the game sheet uses the same voice at a fixed 64px.
- **Headline** (Condensed 700, 40px, 1): the four figures in the figures band.
- **Title** (Condensed 700, 22px, 1.1): room names on the plan; side-sheet titles step up to 28px; the brand mark in the title block is 24px.
- **Section title** (Condensed 700, 18px, uppercase, 0.02em): headed panels such as "Agenda de hoy" and "Historial de partidas". Fieldset legends in the editors use the same style at 16px with a ruled underline.
- **Body** (Barlow 400, 15px, 1.45): the root size. Team names step to 17px/600 on the plan; table cells and notes use 14px; captions and secondary lines 13px.
- **Label** (Condensed 600, 13px, uppercase, 0.06em, graphite): the global `.label` class for field and figure labels. Column headers use 13px/0.05em; the "Ejemplo" flag is 11px in markup red.
- **Button** (Condensed 600, 14px, uppercase, 0.05em): every button and the inline "Editar sala" control (13px).

### Named Rules
**The Tabular Rule.** `font-variant-numeric: tabular-nums` is set on `:root`; every number in the panel is tabular so clocks, scores and times do not jitter as they change.

**The Fixed Ramp Rule.** Sizes are fixed steps (11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 24, 28, 40, 64), not fluid, with the room clock as the single clamp. Scores and figures keep their sizes across contexts so the same kind of number always reads at the same scale.

## Layout

The page is one centred sheet, max 96rem wide, padded 24px top, clamp(16px, 2.5vw, 32px) at the sides and 48px at the bottom, with 24px between its parts. The title block spans the full viewport above it with a single bottom rule.

Order: title block, figures band (four equal cells, two by two under 900px), then the live row (floor plan two thirds, agenda one third with a 20rem minimum; stacked under 1180px), then the history section with its filters. Under 760px the live row moves above the figures, because what is happening in the rooms comes first; the three rooms stack vertically with horizontal double-line partitions, the doors are hidden, and the history table folds room, time and points into the team cell.

Spacing follows a 4px-based scale (`--space-1` to `--space-7`: 4, 8, 12, 16, 24, 32, 48). Panels pad at 12px by 16px for heads and 16px for bodies; the side sheet pads at 24px. Interior structure is drawn with rules, not with gaps: cells in the figures band, puzzle cells, segmented controls and fact grids share borders rather than sitting apart.

## Elevation & Depth

The drawing is flat. Depth on the sheet is conveyed by line weight (6px solid wall, 4px double partition, 1px ink rule, 1px soft rule) and by fills (zone tint, hatch, solid zone), never by shadow. Shadows exist only on things laid over the drawing: the side sheet, select popups and toasts.

### Shadow Vocabulary
- **Side sheet** (`box-shadow: -18px 0 40px -24px rgb(27 31 36 / 0.45)`): the edit sheet sliding in from the right, over a 28% ink scrim.
- **Popup** (`box-shadow: 0 10px 24px -12px rgb(27 31 36 / 0.35)`): select listboxes.
- **Toast** (`box-shadow: 0 12px 28px -14px rgb(27 31 36 / 0.6)`): ink toasts at the bottom centre.

### Named Rules
**The Flat Drawing Rule.** Nothing on the sheet casts a shadow. A shadow means "this is lying on top of the drawing and will go away".

**The Poché Rule.** Solid ink mass is reserved for the plan's outer walls (`--wall`, 6px). Partitions between rooms are double lines; every other boundary is a 1px rule.

## Shapes

Every corner is square (0px), including buttons, inputs, the switch and its thumb, swatches, tags and the side sheet. Forms are rectangles bounded by 1px ink rules. Recurring drafting devices: the boxed room number tag (as on a plan's room code), small square zone swatches, 45-degree hatching for closed rooms and current or pending states, a dashed quarter-circle door swing, double-line partitions, and a dashed markup-red rule above destructive actions.

## Components

### Buttons
Drawn, not pressed: flat rectangles with a 1px border and condensed uppercase labels.
- **Shape:** square (0px), 36px tall, 16px horizontal padding, 8px icon gap.
- **Solid:** ink fill, film text; hover mixes the ink 18% toward film. The single primary action per sheet (save).
- **Line:** transparent with ink border and text; hover inverts to ink fill.
- **Markup:** transparent with red border and text; hover fills red with sheet text. Only for cancel and destructive actions.
- **Bare:** 32px, transparent border that turns ink on hover; for low-weight actions.
- **Disabled:** 40% opacity, not-allowed cursor. Hover effects apply only under `(hover: hover)`.
- **Focus:** the global 2px markup-red outline, offset 2px.

### Chips
None. Status is carried by text colour (abandoned in red), fills (zone) or hatching, not by pills.

### Cards / Containers
There are no cards. Containers are ruled panels: `sheet` background, 1px ink border, 0px corners, no shadow, a ruled head (12px by 16px) with a section title. The figures band and fact grids divide their cells with shared 1px rules.

### Inputs / Fields
- **Style:** 36px, `sheet` background, 1px ink border, square, 15px body text, graphite placeholder.
- **Focus:** the border thickens to 2px by an inset 1px ink shadow; no glow.
- **Error:** red border and inset red line, 13px red message below.
- **Number stepper:** a ruled box with 36px minus/plus cells that invert to ink on hover.
- **Switch:** 44 by 24px ruled box with an 18px square thumb; checked fills ink and the thumb turns film.
- **Select:** ruled trigger that inverts to ink while open; popup is a ruled list with soft-rule separators, highlighted option inverted to ink, zone swatch beside room options.
- **Date field:** Base UI Input type="date", 36px ruled box like the other controls; the browser's calendar indicator is replaced by a drawn 1.5px ink calendar icon.
- **Segmented:** a single ruled group whose items share 1px dividers; pressed item inverted to ink, hover a 7% ink wash.

### Navigation
There is no navigation chrome. The title block replaces the sidebar and topbar: brand cell, drawing title with the zone key, then ruled cells for sheet, date, live clock and data status (the data cell value in red while data is example). Clicking a figure filters the history; clicking a room, session or game opens the side sheet.

### Floor Plan (signature component)
Three enclosures inside a 6px ink wall on `sheet`. Each room: boxed room tag in its zone, condensed name, "Editar sala" control, team and leader, the countdown in display type, four puzzle cells, a score line and a legend of averages above a soft rule. Under 10 minutes the clock turns red with a red ring drawn as a box-shadow (4px sheet gap, 2px markup red) so it never moves the room's grid, plus a "Últimos minutos" note. Room names reserve two lines so every enclosure shares one baseline grid; a trailing number is joined with a non-breaking space ("Laboratorio 47"). Rooms are container-query aware: at 300px wide or less the edit control collapses to an icon button and the score line stacks. A room with no finished games shows "Sin partidas todavía" instead of zeroed averages. Under the plan, a ruled foot gives the room count and the "+ Nueva sala" control. A free room shows its idle state in graphite condensed type and the next booking; a closed room is hatched.

### Puzzle Cells (signature component)
A ruled strip of four 44px cells (26px in the compact size). A solved cell fills with the room's zone by a clip-path wipe rising from the door side (bottom), 700ms on the expo-out curve, text turning `sheet`; the current puzzle is hatched in the zone colour at 38%; unsolved cells stay paper.

### Agenda Matrix
Shows one day (GET /admin/reservations): a head with "Agenda" and a ruled ‹ Hoy › day stepper, the long date, then compact Estado and Sala selects; columns are headed by swatch plus "Sala 0N" and follow the room filter. Team names are set in Barlow Condensed 600 (16px, 15px on mobile, up to two or three lines) so long single words fit narrow columns. A timetable of hours by rooms on `sheet`, soft-ruled cells. Live session: solid zone fill with sheet text. Pending: zone hatch at 22%. Cancelled: team struck through in red. Past: graphite. The current hour row carries a 2px red top rule and red hour.

### Side Sheet
The room editor creates (empty template), edits and deletes rooms; deletion sits behind a dashed markup rule with a two-step confirm, and is refused with an explanation when the room has games or bookings (close it instead). The booking editor moves a booking to another day (date field, min today) and hour, and refuses past slots, taken slots and closed rooms. Validation shows after a field is left, never on an untouched form. A 30rem panel from the right edge, 1px ink left border, 320ms slide on the expo-out curve (200ms ease-in on exit), 28% ink scrim. Head with a zone swatch and 28px condensed title, ruled foot with actions; editors pin a sticky ruled action bar at the bottom.

### Motion
One easing, `--ease-out` (cubic-bezier(0.16, 1, 0.3, 1)), for movement; plain `ease` at 100 to 160ms for colour changes. Reduced motion collapses all durations to near zero.

## Do's and Don'ts

### Do:
- **Do** edit colours in `front/src/config/theme.ts` and reference them as CSS variables (`var(--ink)`, `var(--zone)`) in components.
- **Do** draw structure with 1px rules (`--hair`, `--hair-soft`) and shared borders between adjacent cells.
- **Do** keep every corner square (0px).
- **Do** set numbers in Barlow Condensed with tabular figures, at the fixed sizes of the type ramp.
- **Do** pass a room's colour as `--zone` and use it only for that room: 6% tint, solid fill, hatch, swatch.
- **Do** flag example data with the red "Ejemplo" marker until the API is connected.
- **Do** open detail and editing in the side sheet over the plan instead of navigating away.
- **Do** gate hover styles behind `@media (hover: hover)`.

### Don't:
- **Don't** use rounded corners, pills or chips anywhere.
- **Don't** cast shadows on anything that sits on the drawing; shadows are for the side sheet, popups and toasts only.
- **Don't** use solid ink mass except for the plan's outer walls.
- **Don't** use markup red for decoration, branding or neutral emphasis.
- **Don't** use a zoning colour outside its own room's context.
- **Don't** add a sidebar, KPI card grid or card grid of live games; the plan and the ruled band replace them.
- **Don't** use a cream or warm ground; the film is cool off-white.
- **Don't** hard-code hex values in component CSS.
