import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';

const file = process.env.DB_FILE || path.resolve(import.meta.dirname, '..', 'publichelp.db');
export const db = new DatabaseSync(file);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name       TEXT NOT NULL,
    email           TEXT NOT NULL UNIQUE,
    nic             TEXT,
    phone           TEXT,
    preferred_lang  TEXT NOT NULL DEFAULT 'en',
    password_hash   TEXT NOT NULL,
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS journeys (
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    case_id     TEXT NOT NULL,
    steps       TEXT NOT NULL DEFAULT '[]',
    docs        TEXT NOT NULL DEFAULT '[]',
    updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, case_id)
  );

  CREATE TABLE IF NOT EXISTS questions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
    question    TEXT NOT NULL,
    language    TEXT,
    matched     TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export function publicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    nic: row.nic,
    phone: row.phone,
    preferredLang: row.preferred_lang,
    createdAt: row.created_at,
  };
}
