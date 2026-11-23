# Escape Room · Front (panel de empresa)

React 19 + Vite + TypeScript, con [Base UI](https://base-ui.com) para los componentes.

```bash
npm install
npm run dev     # http://localhost:5173
npm run build
npm run lint
```

## Un solo panel

Todo el lado empresa vive en una pantalla, dibujada como el plano del local:

- **Cifras**: partidas, puntuación media, ocupación y reservas de hoy. Al pulsar una cifra se abre su prueba (historial filtrado o agenda).
- **Planta**: las 3 salas con la partida en directo (reloj, 4 puzzles, puntos). Se refresca cada 3 s.
- **Agenda de hoy**: horario por sesión y sala.
- **Historial**: partidas finalizadas con filtros de sala, periodo y resultado.

Al pulsar una sala, una reserva o una partida se abre una hoja lateral para editarla o verla, sin cambiar de pantalla.

## Estructura

```
src/
├── config/theme.ts      ← COLORES del panel (edita aquí)
├── screens/AdminDashboard/   la pantalla única
├── components/
│   ├── ui/              Base UI personalizado: Button, SelectField, Segmented, Fields, Sheet, Toasts
│   ├── plan/            FloorPlan, PuzzleCells (la planta del local)
│   ├── dashboard/       TitleBlock, FiguresBand, AgendaMatrix, HistorySection
│   └── sheets/          editores de sala/puzzles y reserva, detalle de partida
├── services/adminService.ts   una función por endpoint del back
├── modelsExample/       datos de ejemplo (sin backend)
├── hooks/  types/  utils/  styles/  assets/fonts/
```

## Conectar con el back

La UI solo llama a `services/adminService.ts`. Hoy trabaja sobre una copia en memoria de `modelsExample` (los cambios se pierden al recargar). Cuando la API exista, sustituye el cuerpo de cada función por su `fetch` (el endpoint está encima de cada una) y elimina `modelsExample/`.
