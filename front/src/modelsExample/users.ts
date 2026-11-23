import type { User } from '../types/models';

const names = [
  'Lucía Romero',
  'Mateo Herrera',
  'Valentina Cruz',
  'Diego Navarro',
  'Camila Ortega',
  'Sebastián Ríos',
  'Isabella Vega',
  'Tomás Fuentes',
  'Renata Molina',
  'Joaquín Paredes',
];

export const usersExample: User[] = names.map((name, i) => ({
  id: `0f5e9c40-1a2b-4c3d-8e9f-00000000000${i}`,
  name,
  email: `${name.split(' ')[0]!.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')}@mail.com`,
  role: 'player',
}));

export const adminExample: User = {
  id: '0f5e9c40-1a2b-4c3d-8e9f-adm1n0000000',
  name: 'Administración',
  email: 'admin@escaperoom.com',
  role: 'admin',
};
