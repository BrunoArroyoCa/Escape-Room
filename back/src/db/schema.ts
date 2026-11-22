//Here we are going to create the model and the tables

import {
  pgTable,
  uuid,
  varchar,
  integer,
  real,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';

export const userTable = pgTable('user_table', {
  id_user: uuid('id_user').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  rol: varchar('rol', { length: 255 }).notNull(),
});

export const mapTable = pgTable('map_table', {
  id_map: uuid('id_map').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  difficulty: integer('difficulty').notNull(),
  max_score: real('max_score').notNull(),
  time_limit: integer('time_limit').notNull(),
  is_active: boolean('is_active').notNull().default(true),
});

export const puzzlesTable = pgTable('puzzles_table', {
  id_puzzles: uuid('id_puzzles').primaryKey().defaultRandom(),
  id_map: uuid('id_map')
    .notNull()
    .references(() => mapTable.id_map),
  index1_4: integer('index1_4').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: varchar('message', { length: 255 }).notNull(),
  solution: varchar('solution', { length: 255 }).notNull(),
  hint: varchar('hint', { length: 255 }),
});

export const reservations = pgTable('reservations', {
  id_reservations: uuid('id_reservations').primaryKey().defaultRandom(),
  id_map: uuid('id_map')
    .notNull()
    .references(() => mapTable.id_map),
  id_user: uuid('id_user')
    .notNull()
    .references(() => userTable.id_user),
  reserve_at: timestamp('reserve_at').notNull(),
  status: varchar('status', { length: 255 }).notNull(),
  team: varchar('team', { length: 255 }),
});

export const gameTable = pgTable('game_table', {
  id_game: uuid('id_game').primaryKey().defaultRandom(),
  id_reservations: uuid('id_reservations')
    .notNull()
    .references(() => reservations.id_reservations),
  id_user: uuid('id_user')
    .notNull()
    .references(() => userTable.id_user),
  id_map: uuid('id_map')
    .notNull()
    .references(() => mapTable.id_map),
  score: real('score').notNull().default(0),
  progress: real('progress').notNull().default(0),
  started_at: timestamp('started_at').notNull().defaultNow(),
  ended_at: timestamp('ended_at'),
  status: varchar('status', { length: 255 }).notNull(),
});
