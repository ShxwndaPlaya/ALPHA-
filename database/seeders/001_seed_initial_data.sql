-- =====================================
-- ALPHA LAN - Initial Data Seeder
-- =====================================

INSERT OR IGNORE INTO users (username, email, password, role, xp)
VALUES 
  ('admin', 'admin@alpha.lan', 'admin123', 'admin', 0),
  ('alice', 'alice@alpha.lan', 'password', 'student', 120),
  ('bob', 'bob@alpha.lan', 'password', 'student', 200);

INSERT OR IGNORE INTO projects (ownerId, title, description, code, language)
VALUES
  (1, 'LAN Messenger', 'A local chat prototype using Socket.io', 'console.log(\"LAN Chat ready\")', 'javascript'),
  (2, 'Number Sorter', 'Simple Python sorting program', 'nums = [5,3,1,4,2]\\nprint(sorted(nums))', 'python');

INSERT OR IGNORE INTO badges (badgeId, userId)
VALUES 
  ('first-login', 2),
  ('bug-slayer', 3);

INSERT OR IGNORE INTO challenges (challengeId, title, description, difficulty, xp, language)
VALUES
  ('hello-world', 'Hello, ALPHA!', 'Print Hello, ALPHA LAN!', 'beginner', 50, 'python'),
  ('sum-two-numbers', 'Sum of Two Numbers', 'Add two numbers', 'beginner', 100, 'javascript');
