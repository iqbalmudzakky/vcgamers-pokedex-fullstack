import axios from "axios";
import type { PokemonDocument } from "../types/pokemon";
import {
  PokeApiListResponse,
  PokeApiPokemonDetailResponse,
} from "../types/pokeapi";
import { upsertManyPokemons } from "../repositories/pokemon.repository";
import { mapDetailToDocument } from "../mappers/pokemon.mapper";

const POKE_API_BASE_URL =
  process.env.POKE_API_BASE_URL || "https://pokeapi.co/api/v2";

export async function syncPokemonPage(limit: number, offset: number) {
  const listResponse = await axios.get<PokeApiListResponse>(
    `${POKE_API_BASE_URL}/pokemon`,
    {
      params: { limit, offset },
    },
  );

  const list = listResponse.data.results;

  const detailData = await Promise.all(
    list.map(async (item) => {
      const { data } = await axios.get<PokeApiPokemonDetailResponse>(
        `${POKE_API_BASE_URL}/pokemon/${item.name}`,
      );
      return data;
    }),
  );

  const docs: PokemonDocument[] = detailData.map(mapDetailToDocument);

  await upsertManyPokemons(docs);

  return {
    syncedCount: docs.length,
    offset,
    limit,
  };
}

export async function syncPokemonByName(name: string) {
  const { data } = await axios.get<PokeApiPokemonDetailResponse>(
    `${POKE_API_BASE_URL}/pokemon/${name.toLowerCase()}`,
  );

  const doc = mapDetailToDocument(data);
  await upsertManyPokemons([doc]);

  return doc;
}
