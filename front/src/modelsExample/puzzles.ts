import type { Puzzle } from '../types/models';
import { mapsExample } from './maps';

type PuzzleSeed = Pick<Puzzle, 'title' | 'message' | 'solution' | 'hint'>;

const seeds: PuzzleSeed[][] = [
  [
    { title: 'El atanor apagado', message: 'Tres frascos, un solo fuego. El orden importa.', solution: 'AZUFRE-MERCURIO-SAL', hint: 'Mira los símbolos grabados en la repisa.' },
    { title: 'La balanza del alquimista', message: 'Equilibra el plomo con lo que brilla.', solution: '7', hint: 'Cuenta las monedas del cofre.' },
    { title: 'El libro sellado', message: 'Solo se abre con la palabra que no se pronuncia.', solution: 'SILENTIUM', hint: null },
    { title: 'La piedra filosofal', message: 'Une las cuatro esencias en el círculo.', solution: 'TIERRA-AGUA-AIRE-FUEGO', hint: 'El mapa del techo marca el sentido.' },
  ],
  [
    { title: 'Registro de acceso', message: 'El último que salió dejó su turno anotado.', solution: '0347', hint: 'El reloj de la pared se paró a esa hora.' },
    { title: 'Muestra contaminada', message: 'Ordena los tubos por su número atómico.', solution: 'H-HE-LI-BE', hint: 'La tabla periódica tiene cuatro casillas marcadas.' },
    { title: 'Microscopio', message: 'Lo que ves no es lo que hay.', solution: 'ESPEJO', hint: null },
    { title: 'Puerta estanca', message: 'Introduce el código del protocolo 47.', solution: '4-7-4-7', hint: 'El protocolo está en la taquilla del fondo.' },
  ],
  [
    { title: 'El billete perdido', message: 'Un pasajero no aparece en la lista.', solution: 'VAGÓN 6', hint: 'Compara la lista con los asientos ocupados.' },
    { title: 'El revisor', message: 'Su reloj adelanta lo mismo que el andén.', solution: '23:47', hint: null },
    { title: 'Equipaje de mano', message: 'La maleta tiene tres cerraduras y una etiqueta.', solution: '281', hint: 'La etiqueta lleva el número de vuelo invertido.' },
    { title: 'Freno de emergencia', message: 'Detén el tren antes de la última estación.', solution: 'PALANCA ROJA', hint: 'El mapa de la línea indica la estación.' },
  ],
];

export const puzzlesExample: Puzzle[] = mapsExample.flatMap((map, m) =>
  seeds[m]!.map((seed, i) => ({
    id_puzzles: `${map.id_map.slice(0, -2)}p${i + 1}`,
    id_map: map.id_map,
    index1_4: i + 1,
    ...seed,
  })),
);
