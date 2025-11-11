-- =====================================
-- ALPHA LAN - Migration #2
-- XP History + Achievements + Leaderboard
-- =====================================

-- Track every XP event for transparency and gamification
CREATE TABLE IF NOT EXISTS xp_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  source TEXT NOT NULL, -- e.g. "challenge", "badge", "project_upload", "admin_bonus"
  sourceId TEXT,         -- optional, links to challengeId or badgeId
  xpChange INTEGER NOT NULL,
  description TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(userId) REFERENCES users(id)
);

-- Store user achievements that are not simple badges
CREATE TABLE IF NOT EXISTS achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  earnedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(userId) REFERENCES users(id)
);

-- Lightweight leaderboard view (cached or generated periodically)
CREATE VIEW IF NOT EXISTS leaderboard AS
SELECT 
  id AS userId,
  username,
  xp,
  role,
  createdAt
FROM users
ORDER BY xp DESC, createdAt ASC;
