-- =====================================
-- ALPHA LAN - Migration #5
-- Channels & Group Management
-- =====================================

-- Channels (public or private chat spaces)
CREATE TABLE IF NOT EXISTS channels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'public',       -- 'public', 'private', 'group'
  createdBy INTEGER,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(createdBy) REFERENCES users(id)
);

-- Channel membership table
CREATE TABLE IF NOT EXISTS channel_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  channelId INTEGER NOT NULL,
  userId INTEGER NOT NULL,
  role TEXT DEFAULT 'member',       -- 'admin', 'moderator', 'member'
  joinedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(channelId) REFERENCES channels(id),
  FOREIGN KEY(userId) REFERENCES users(id)
);

-- Group metadata (e.g. coding clubs, classes, teams)
CREATE TABLE IF NOT EXISTS groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  createdBy INTEGER,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(createdBy) REFERENCES users(id)
);

-- Memberships for user-group relation
CREATE TABLE IF NOT EXISTS group_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  groupId INTEGER NOT NULL,
  userId INTEGER NOT NULL,
  role TEXT DEFAULT 'member',       -- 'owner', 'admin', 'member'
  joinedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(groupId) REFERENCES groups(id),
  FOREIGN KEY(userId) REFERENCES users(id)
);

-- Linking channels to groups (each group can have multiple sub-channels)
CREATE TABLE IF NOT EXISTS group_channels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  groupId INTEGER NOT NULL,
  channelId INTEGER NOT NULL,
  FOREIGN KEY(groupId) REFERENCES groups(id),
  FOREIGN KEY(channelId) REFERENCES channels(id)
);
