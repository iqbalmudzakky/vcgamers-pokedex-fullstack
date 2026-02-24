import { getDb } from "../lib/mongo";
import type { PokemonDocument } from "../types/pokemon";

const COLLECTION_NAME = "pokemons";

type FindPokemonParams = {
  limit: number;
  offset: number;
  search?: string;
};

export function getPokemonCollection() {
  return getDb().collection<PokemonDocument>(COLLECTION_NAME);
}

export async function ensurePokemonIndexes() {
  const collection = getPokemonCollection();

  await collection.createIndex({ pokemonId: 1 }, { unique: true });
  await collection.createIndex({ name: 1 }, { unique: true });
}

export async function upsertManyPokemons(docs: PokemonDocument[]) {
  const collection = getPokemonCollection();

  await collection.bulkWrite(
    docs.map((doc) => ({
      updateOne: {
        filter: { pokemonId: doc.pokemonId },
        update: { $set: doc },
        upsert: true,
      },
    })),
  );
}

export async function findPokemon(params: FindPokemonParams) {
  const { limit, offset, search } = params;
  const collection = getPokemonCollection();

  return collection
    .find(buildFilter(search), {
      projection: {
        _id: 0,
        pokemonId: 1,
        name: 1,
        types: 1,
        height: 1,
        weight: 1,
        "sprites.front_default": 1,
        "sprites.back_default": 1,
        "sprites.front_shiny": 1,
        updatedAt: 1,
      },
    })
    .sort({ pokemonId: 1 })
    .skip(offset)
    .limit(limit)
    .toArray();
}

export async function countPokemon(search?: string) {
  const collection = getPokemonCollection();
  return collection.countDocuments(buildFilter(search));
}

export async function findPokemonByName(name: string) {
  const collection = getPokemonCollection();

  return collection.findOne(
    { name: name.toLowerCase() },
    {
      projection: {
        _id: 0,
        pokemonId: 1,
        name: 1,
        types: 1,
        height: 1,
        weight: 1,
        moves: 1,
        speciesUrl: 1,
        "sprites.front_default": 1,
        "sprites.back_default": 1,
        "sprites.front_shiny": 1,
      },
    },
  );
}

function buildFilter(search?: string) {
  if (!search) return {};
  const q = sanitizeSearch(search);
  if (!q) return {};

  return {
    name: {
      $regex: q,
      $options: "i",
    },
  };
}

function sanitizeSearch(value: string) {
  const lower = value.toLowerCase().trim();
  let clean = "";

  for (const ch of lower) {
    const isAlpha = ch >= "a" && ch <= "z";
    const isDigit = ch >= "0" && ch <= "9";
    if (isAlpha || isDigit || ch === "-" || ch === " ") {
      clean += ch;
    }
  }

  return clean;
}
