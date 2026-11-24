import {
  checkDeSalaHistorial,
  crearMapa,
  editarPuzzle,
  editMapa,
  eliminarMapaPuzzles,
  listarLosMapas,
  salaConPuzzles,
} from "../repositoryCompany/repositoryComp.ts";
import type { MapModel } from "../models/mapModel.ts";
import { ConflictError } from "./errors.ts";

//Salas y sus puzzles

type PuzzleInput = Parameters<typeof crearMapa>[1][number];

//GET /admin/maps
export async function listarSalas() {
  return await listarLosMapas();
}

//GET /admin/maps/:id
export async function obtenerSala(id: string) {
  return await salaConPuzzles(id);
}

//POST /admin/maps
export async function crearSala(sala: MapModel, puzzles: PuzzleInput[]) {
  const { map } = await crearMapa(sala, puzzles);
  return map;
}

//PUT /admin/maps/:id
export async function editarSala(id: string, cambios: Partial<MapModel>) {
  const [map] = await editMapa(cambios, id);
  return map ?? null;
}

//PUT /admin/maps/:id/puzzles/:index
export async function editarPuzzleDeSala(
  idMap: string,
  index: number,
  cambios: Partial<PuzzleInput>,
) {
  const [puzzle] = await editarPuzzle(idMap, index, cambios);
  return puzzle ?? null;
}

//DELETE /admin/maps/:id
export async function eliminarSala(id: string) {
  if (!(await checkDeSalaHistorial(id))) {
    throw new ConflictError(
      "La sala tiene partidas o reservas; ciérrala en lugar de eliminarla.",
    );
  }
  const { map } = await eliminarMapaPuzzles(id);
  return map[0] ?? null;
}
