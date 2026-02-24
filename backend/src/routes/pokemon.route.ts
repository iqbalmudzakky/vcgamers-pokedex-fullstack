import { Router } from "express";
import { syncPokemonPage } from "../services/pokemon-sync.service";
import { getPokemonList } from "../services/pokemon-list.service";
import { getPokemonDetail } from "../services/pokemon-detail.service";

export const pokemonRouter = Router();

pokemonRouter.post("/sync", async (req, res) => {
  try {
    const limitRaw = req.query.limit;
    const offsetRaw = req.query.offset;

    const limit = Number(limitRaw ?? 8);
    const offset = Number(offsetRaw ?? 0);

    const result = await syncPokemonPage(limit, offset);

    res.json({
      ok: true,
      message: "Pokemon synced successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Failed to sync pokemon",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

pokemonRouter.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 8);
    const search = String(req.query.search ?? "");

    const result = await getPokemonList({
      page: Number.isNaN(page) ? 1 : page,
      limit: Number.isNaN(limit) ? 8 : limit,
      search,
    });

    res.json({
      ok: true,
      message: "Pokemon list fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Failed to fecth pokemon list",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

pokemonRouter.get("/:name", async (req, res) => {
  try {
    const name = String(req.params.name || "").trim();

    if (!name) {
      return res.status(400).json({
        ok: false,
        message: "Pokemon name is required",
      });
    }

    const data = await getPokemonDetail(name);

    return res.json({
      ok: true,
      message: "Pokemon detail fetched successfully",
      data,
    });
  } catch (error) {
    return res.status(404).json({
      ok: false,
      message: "Pokemon detail not found",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
