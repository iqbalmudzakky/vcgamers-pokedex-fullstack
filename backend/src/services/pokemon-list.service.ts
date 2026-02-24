import axios from "axios";
import { countPokemon, findPokemon } from "../repositories/pokemon.repository";
import { syncPokemonByName, syncPokemonPage } from "./pokemon-sync.service";

type GetPokemonListParams = {
  page: number;
  limit: number;
  search?: string;
};

export async function getPokemonList(params: GetPokemonListParams) {
  const page = Math.max(1, params.page);
  const limit = Math.max(1, params.limit);
  const search = params.search?.trim() || "";
  const offset = (page - 1) * limit;

  if (!search) {
    const totalBefore = await countPokemon();
    const needed = offset + limit;
    if (totalBefore < needed) {
      await syncPokemonPage(limit, offset);
    }
  }

  if (search) {
    const existing = await countPokemon(search);
    if (existing === 0) {
      try {
        await syncPokemonByName(search);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          // there are no pokemon data, ignore result {}
        } else {
          throw error;
        }
      }
    }
  }

  const [items, total] = await Promise.all([
    findPokemon({ limit, offset, search: search || undefined }),
    countPokemon(search || undefined),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      hasMore: offset + items.length < total,
    },
  };
}
