-- =====================================
-- ALPHA LAN - Migration #4
-- Notifications & Announcements System
-- =====================================

-- System or admin-created announcements (visible to all users)
CREATE TABLE IF NOT EXISTS announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  authorId INTEGER,
  category TEXT DEFAULT 'general', -- e.g., 'update', 'event', 'maintenance'
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  expiresAt DATETIME,
  pinned INTEGER DEFAULT 0, -- 1 = pinned, 0 = normal
  FOREIGN KEY(authorId) REFERENCES users(id)
);

-- User-specific notifications (private alerts, achievements, replies, etc.)
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  type TEXT NOT NULL,       -- e.g., 'message', 'badge', 'system', 'admin'
  title TEXT,
  message TEXT NOT NULL,
  relatedId TEXT,           -- optional, links to a challenge, message, etc.
  isRead INTEGER DEFAULT 0, -- 0 = unread, 1 = read
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(userId) REFERENCES users(id)
);

-- Optional: logs for sent broadcasts (admin transparency)
CREATE TABLE IF NOT EXISTS notification_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  senderId INTEGER,
  target TEXT,              -- 'all', 'role:student', 'user:12', etc.
  message TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(senderId) REFERENCES users(id)
);
