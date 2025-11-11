-- =====================================
-- ALPHA LAN - Migration #3
-- User Stats & Activity Tracking
-- =====================================

-- Tracks ongoing stats per user (updated incrementally)
CREATE TABLE IF NOT EXISTS user_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL UNIQUE,
  messagesSent INTEGER DEFAULT 0,
  projectsUploaded INTEGER DEFAULT 0,
  challengesCompleted INTEGER DEFAULT 0,
  badgesEarned INTEGER DEFAULT 0,
  logins INTEGER DEFAULT 0,
  lastActive DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(userId) REFERENCES users(id)
);

-- Records each user session or login for audit/logging
CREATE TABLE IF NOT EXISTS user_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  loginTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  logoutTime DATETIME,
  ipAddress TEXT,
  device TEXT,
  FOREIGN KEY(userId) REFERENCES users(id)
);

-- Optional: maintain a log of user actions for analysis or gamified streaks
CREATE TABLE IF NOT EXISTS activity_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER,
  activityType TEXT,        -- e.g., "sent_message", "uploaded_project", "earned_badge"
  details TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(userId) REFERENCES users(id)
);
