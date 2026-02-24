import type { PokeApiPokemonDetailResponse } from "../types/pokeapi";
import type { PokemonDocument } from "../types/pokemon";

export function mapDetailToDocument(
  p: PokeApiPokemonDetailResponse,
): PokemonDocument {
  return {
    pokemonId: p.id,
    name: p.name,
    height: p.height,
    weight: p.weight,
    sprites: {
      front_default: p.sprites.front_default,
      back_default: p.sprites.back_default,
      front_shiny: p.sprites.front_shiny,
    },
    types: p.types,
    moves: p.moves.slice(0, 10),
    speciesUrl: p.species.url,
    updatedAt: new Date(),
  };
}
