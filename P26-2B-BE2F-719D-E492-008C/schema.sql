CREATE TABLE IF NOT EXISTS users (
    discord_id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS characters (
    id TEXT PRIMARY KEY,
    discord_id TEXT,
    name TEXT NOT NULL,
    class TEXT NOT NULL,
    strength INTEGER NOT NULL,
    dexterity INTEGER NOT NULL,
    constitution INTEGER NOT NULL,
    intelligence INTEGER NOT NULL,
    wisdom INTEGER NOT NULL,
    charisma INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (discord_id) REFERENCES users(discord_id)
);

CREATE TABLE IF NOT EXISTS audit_rolls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    discord_id TEXT,
    username TEXT,
    dice_type TEXT NOT NULL,
    result INTEGER NOT NULL,
    modifier INTEGER DEFAULT 0,
    total INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);