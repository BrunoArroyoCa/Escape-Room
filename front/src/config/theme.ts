/**
 * CONFIGURACIÓN DE COLORES
 *
 * Todos los colores del panel salen de aquí. Cada clave se convierte en una
 * variable CSS al arrancar (ThemeProvider):  graphite → --graphite
 *
 * - Para cambiar un color: edita su valor.
 * - `zones` son los colores de zonificación de cada sala, en el mismo orden
 *   que las salas. Se usan como relleno de puzzles resueltos y como tinte
 *   del recinto. Si los cambias, mantén texto blanco legible encima (≥4.5:1)
 *   y colores claramente distintos entre sí.
 * - `extraZone` es el color de las salas a partir de la cuarta. No hay un
 *   cuarto tono que se distinga de los tres anteriores para daltónicos, así
 *   que es un grafito neutro; cada sala se identifica además por su número.
 */

export interface Theme {
  /** Fondo: film de dibujo */
  ground: string;
  /** Superficies elevadas: panel lateral, tabla */
  sheet: string;
  /** Tinta principal: texto y líneas */
  ink: string;
  /** Texto secundario */
  graphite: string;
  /** Líneas finas y separadores */
  rule: string;
  /** Marcas en rojo: alertas, edición, cancelación */
  markup: string;
  /** Colores de zonificación por sala */
  zones: [string, string, string];
  /** Color de las salas 4 en adelante */
  extraZone: string;
}

export const theme: Theme = {
  ground: '#F2F3F0',
  sheet: '#FBFBF9',
  ink: '#1B1F24',
  graphite: '#62676E',
  rule: '#C9CBC6',
  markup: '#C8322A',
  zones: ['#00836E', '#9E640C', '#6E52A0'],
  extraZone: '#4F555C',
};
