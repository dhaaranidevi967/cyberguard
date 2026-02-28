import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("cyberguard.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS incidents (
    id TEXT PRIMARY KEY,
    type TEXT,
    target TEXT,
    timestamp TEXT,
    riskScore INTEGER,
    patterns TEXT
  );

  CREATE TABLE IF NOT EXISTS honeypot_events (
    id TEXT PRIMARY KEY,
    scam_type TEXT,
    intel_extracted TEXT,
    timestamp TEXT
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/incidents", (req, res) => {
    const incidents = db.prepare("SELECT * FROM incidents ORDER BY timestamp DESC").all();
    res.json(incidents.map((i: any) => ({
      ...i,
      patterns: JSON.parse(i.patterns)
    })));
  });

  app.post("/api/incidents", (req, res) => {
    const { id, type, target, timestamp, riskScore, patterns } = req.body;
    db.prepare("INSERT INTO incidents (id, type, target, timestamp, riskScore, patterns) VALUES (?, ?, ?, ?, ?, ?)")
      .run(id, type, target, timestamp, riskScore, JSON.stringify(patterns));
    res.json({ status: "ok" });
  });

  app.get("/api/honeypot", (req, res) => {
    const events = db.prepare("SELECT * FROM honeypot_events ORDER BY timestamp DESC LIMIT 50").all();
    res.json(events);
  });

  app.post("/api/honeypot", (req, res) => {
    const { id, scam_type, intel_extracted, timestamp } = req.body;
    db.prepare("INSERT INTO honeypot_events (id, scam_type, intel_extracted, timestamp) VALUES (?, ?, ?, ?)")
      .run(id, scam_type, intel_extracted, timestamp);
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
