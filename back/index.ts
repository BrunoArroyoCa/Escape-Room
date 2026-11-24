import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { obtenerDashboard } from "./src/servicesCompany/dashboardService.ts";
import {
  listarPartidas,
  listarPartidasEnCurso,
  obtenerPartida,
} from "./src/servicesCompany/gamesService.ts";
import {
  crearSala,
  editarPuzzleDeSala,
  editarSala,
  eliminarSala,
  listarSalas,
  obtenerSala,
} from "./src/servicesCompany/mapsService.ts";
import {
  cancelarReserva,
  editarReserva,
  listarAgenda,
  obtenerReserva,
} from "./src/servicesCompany/reservationsService.ts";
import { ConflictError } from "./src/servicesCompany/errors.ts";

const app: Express = express();
app.use(express.json());

//Lee un query param de texto (?map=...)
const texto = (v: unknown) => (typeof v === "string" && v ? v : undefined);
//Lee un query param de fecha ISO (?from=...)
const fecha = (v: unknown) => {
  const s = texto(v);
  const d = s ? new Date(s) : undefined;
  return d && !Number.isNaN(d.getTime()) ? d : undefined;
};
//Responde 404 si el servicio devuelve null
const enviar = (res: Response, data: unknown) =>
  data === null
    ? res.status(404).json({ error: "No encontrado" })
    : res.json(data);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

/* ───────────── Dashboard y partidas ───────────── */

app.get("/admin/dashboard", async (req, res) => {
  res.json(await obtenerDashboard());
});

app.get("/admin/games", async (req, res) => {
  res.json(
    await listarPartidas({
      status: texto(req.query.status),
      mapId: texto(req.query.map),
      from: fecha(req.query.from),
      to: fecha(req.query.to),
    }),
  );
});

//Antes que /admin/games/:id para que "live" no se lea como id
app.get("/admin/games/live", async (req, res) => {
  res.json(await listarPartidasEnCurso());
});

app.get("/admin/games/:id", async (req, res) => {
  enviar(res, await obtenerPartida(req.params.id));
});

/* ───────────── Salas y puzzles ───────────── */

app.get("/admin/maps", async (req, res) => {
  res.json(await listarSalas());
});

app.get("/admin/maps/:id", async (req, res) => {
  enviar(res, await obtenerSala(req.params.id));
});

app.post("/admin/maps", async (req, res) => {
  const { puzzles, ...sala } = req.body ?? {};
  if (!Array.isArray(puzzles) || puzzles.length !== 4) {
    res.status(400).json({ error: "La sala necesita exactamente 4 puzzles." });
    return;
  }
  res.status(201).json(await crearSala(sala, puzzles));
});

app.put("/admin/maps/:id", async (req, res) => {
  enviar(res, await editarSala(req.params.id, req.body ?? {}));
});

app.put("/admin/maps/:id/puzzles/:index", async (req, res) => {
  const index = Number(req.params.index);
  if (!Number.isInteger(index) || index < 1 || index > 4) {
    res.status(400).json({ error: "El índice del puzzle va de 1 a 4." });
    return;
  }
  enviar(res, await editarPuzzleDeSala(req.params.id, index, req.body ?? {}));
});

app.delete("/admin/maps/:id", async (req, res) => {
  enviar(res, await eliminarSala(req.params.id));
});

/* ───────────── Agenda de reservas ───────────── */

app.get("/admin/reservations", async (req, res) => {
  res.json(
    await listarAgenda({
      from: fecha(req.query.from),
      to: fecha(req.query.to),
      status: texto(req.query.status),
      mapId: texto(req.query.map),
    }),
  );
});

app.get("/admin/reservations/:id", async (req, res) => {
  enviar(res, await obtenerReserva(req.params.id));
});

app.put("/admin/reservations/:id", async (req, res) => {
  const { reserve_at, ...resto } = req.body ?? {};
  const cambios = reserve_at ? { ...resto, reserve_at: new Date(reserve_at) } : resto;
  enviar(res, await editarReserva(req.params.id, cambios));
});

app.delete("/admin/reservations/:id", async (req, res) => {
  enviar(res, await cancelarReserva(req.params.id));
});

/* ───────────── Errores ───────────── */

//Express 5 manda aquí los errores de los handlers async
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ConflictError) {
    res.status(409).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(3000);
