# 💡 ALPHA LAN (DevConnect LAN)

**ALPHA LAN** is an offline-first, local network ecosystem built for schools, coding clubs, and developers to **chat, code, collaborate, and share projects** — all without the internet.

It transforms a local network (LAN) into a mini developer universe ⚡

---

## 🌟 Core Features

### 💬 Chat System
- Real-time LAN messaging (no internet needed)
- Group & private chats
- Share code snippets with syntax highlighting
- Voice/video calls via WebRTC
- Emoji, reactions, and file sharing
- Custom themes & chat UI styles

### 💻 Built-in IDE & Compiler
- Multi-language editor (Python, C, C++, Java, JS, etc.)
- Auto-completion, error linting, and syntax highlighting
- Terminal-like console output
- Multi-user real-time collaboration
- Local sandbox execution environment
- Split-view editing support

### 🛍️ Code Shop / Marketplace
- Share, download, and rate code projects
- Leave comments & reviews
- “Fork” projects to remix and learn
- Earn XP, badges, and climb leaderboards
- Reputation system to highlight active contributors

### 🌐 Web Simulator
- Live HTML/CSS/JS preview (like CodePen)
- Console and device view
- Share demos instantly over LAN
- Save and export mini-sites

### 🧠 Gamified Learning
- Coding challenges, quizzes, and hackathons
- XP & developer level progression system
- AI Tutor that explains and suggests code
- Achievements: “Night Coder”, “Bug Slayer”, etc.

### 🧰 Admin & Utility
- Admin dashboard & analytics
- Role-based access: students, teachers, admins
- Broadcast announcements and manage users
- Full moderation and activity logs

---

## 🧩 Architecture

```
ALPHA-/
│
├── README.md
├── package.json
├── .gitignore
├── .env
│
├── client/               # Frontend (React + Vite)
│   ├── public/
│   └── src/
│
├── server/               # Backend (Node.js + Express)
│   ├── server.js
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── utils/
│
└── database/             # Local SQLite (or other)
```

---

## ⚙️ Tech Stack

### **Frontend**
- React (Vite) + Tailwind CSS
- Socket.IO client for LAN messaging
- Monaco Editor / CodeMirror for IDE
- Recharts + Shadcn UI components

### **Backend**
- Node.js + Express
- SQLite (via Sequelize or better-sqlite3)
- Socket.IO (real-time events)
- Child process sandbox for code execution

### **Networking**
- Local LAN broadcasting via mDNS / Socket.IO discovery
- Peer-to-peer calls via WebRTC

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/ALPHA-.git
cd devconnect-lan
```

### 2. Install dependencies
```bash
npm install
cd client && npm install && cd ..
```

### 3. Configure environment
Create a `.env` file in the root:
```bash
PORT=5000
NODE_ENV=development
DB_PATH=./database/ALPHA-.db
```

### 4. Run in development
```bash
npm run dev
```
This will start both the backend and frontend (using concurrently or separate terminals).

### 5. Build for production
```bash
cd client && npm run build
```

Then serve the static files via Express automatically.

---

## 🔐 Security & Privacy
- 100% offline operation — no cloud servers required
- Local-only authentication (stored in encrypted form)
- Optional LAN encryption using TLS self-signed certs

---

## 🧠 Future Enhancements
- LAN discovery with QR or auto-detect peers
- AI-assisted debugging and recommendations
- Integrated Git-like versioning system for shared code
- Local leaderboard sync between nodes

---

## 👨‍💻 Contributing
Pull requests are welcome! Please follow the file structure and modular approach.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature-new`)  
3. Commit your changes  
4. Push and open a PR

---

## 📜 License
MIT License © 2025 ALPHA LAN Team
