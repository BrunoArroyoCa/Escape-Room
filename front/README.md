# Escape Room · Front

React 19 + Vite + TypeScript, con [Base UI](https://base-ui.com) (componentes) y [Motion](https://motion.dev) (animaciones).

```bash
npm install
npm run dev     # http://localhost:5173
npm run build
npm run lint
```

## Estructura

```
src/
├── config/          Configuración de la app
│   ├── theme.ts         ← COLORES: temas, colores por sala, radio. Edita aquí.
│   ├── ThemeProvider.tsx  vuelca el tema a variables CSS (--color-*)
│   └── navigation.ts    entradas del menú lateral
├── screens/         Pantallas (componen componentes, gestionan estado y datos)
│   └── admin/
│       ├── DashboardScreen/
│       └── GamesScreen/
├── components/      Componentes reutilizables
│   ├── ui/              wrappers de Base UI personalizados (Button, Select, Tabs, Modal…)
│   ├── layout/          AdminLayout, Sidebar, Topbar, ThemeMenu
│   ├── dashboard/       StatCard, WeeklyActivityChart, RoomPerformance, TodayReservations
│   └── games/           LiveGameCard, GamesHistoryTable, GameDetailDialog, filtros…
├── services/        Una función por endpoint del back (hoy leen modelsExample)
├── modelsExample/   Datos de ejemplo para desarrollo (sin backend)
├── hooks/           useAsync, useLiveGames (polling), useNow
├── types/           Tipos del dominio (espejo de back/src/db/schema.ts)
├── utils/           Formateo, colores por sala
└── styles/          CSS global
```

## Colores

Todo color sale de `src/config/theme.ts`. Cada clave se convierte en una variable CSS
(`surfaceRaised` → `--color-surface-raised`) y los componentes solo usan esas variables.
Para añadir un tema copia uno de `themes`; aparecerá solo en el selector del topbar.

## Conectar con el back

Las pantallas nunca importan `modelsExample`; solo llaman a `services/adminGamesService.ts`.
Cuando la API esté lista, sustituye el cuerpo de cada función por su `fetch` (el endpoint está
documentado encima de cada una) y elimina `modelsExample/`.
