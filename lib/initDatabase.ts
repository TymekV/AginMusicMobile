import { SQLiteDatabase } from 'expo-sqlite';

export default async function initDatabase(db: SQLiteDatabase) {
    await db.execAsync('PRAGMA journal_mode = WAL');
    await db.execAsync('PRAGMA foreign_keys = ON');

    await db.execAsync(`CREATE TABLE IF NOT EXISTS childrenCache (
        id TEXT not null,
        data TEXT not null,
        primary key (id)
    )`);

    await db.execAsync(`CREATE TABLE IF NOT EXISTS lyricsCache (
        id TEXT not null,
        data TEXT not null,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP not null,
        primary key (id)
    )`);

    await db.execAsync(`CREATE TABLE IF NOT EXISTS pins (
        id TEXT not null,
        name TEXT not null,
        description TEXT not null,
        type TEXT not null,
        coverArt TEXT not null,
        pinOrder INT not null,
        primary key (id)
    )`);
}