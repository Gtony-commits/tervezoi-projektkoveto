import { env } from 'cloudflare:workers';

import {
  createPageCommentsCreatedIndex,
  createPageCommentsPageIndex,
  createPageCommentsTable,
} from '@/db/schema';

export type PageCommentRow = {
  id: string;
  page_key: string;
  author_name: string;
  body: string;
  x_percent: number;
  y_percent: number;
  created_at: string;
  updated_at: string | null;
};

function database() {
  const binding = (env as unknown as { DB?: D1Database }).DB;
  if (!binding) {
    throw new Error('A DB adatbázis-kapcsolat nem érhető el.');
  }
  return binding;
}

export async function ensureCommentsSchema() {
  const db = database();
  await db.batch([
    db.prepare(createPageCommentsTable),
    db.prepare(createPageCommentsPageIndex),
    db.prepare(createPageCommentsCreatedIndex),
  ]);
  return db;
}
