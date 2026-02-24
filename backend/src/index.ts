import "dotenv/config";

import express from "express";
import cors from "cors";
import { connectToMongo, getDb } from "./lib/mongo";
import { pokemonRouter } from "./routes/pokemon.route";
import { ensurePokemonIndexes } from "./repositories/pokemon.repository";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/pokemon", pokemonRouter);

app.get("/api/health", async (_req, res) => {
  try {
    const db = getDb();
    await db.command({ ping: 1 });

    res.json({
      ok: true,
      message: "Backend running",
      db: "connected",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Backend running but DB not connected",
      db: "disconnected",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await connectToMongo();
    await ensurePokemonIndexes();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
