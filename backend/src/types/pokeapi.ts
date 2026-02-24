import { PokemonDocument, PokemonListItem, PokemonSprites } from "./pokemon";

export type PokeApiListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
};

export type PokeApiPokemonDetailResponse = {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: PokemonSprites;
  types: PokemonDocument["types"];
  moves: PokemonDocument["moves"];
  species: PokemonListItem;
};

export type PokeApiEvolutionNode = {
  species: PokemonListItem;
  evolves_to: PokeApiEvolutionNode[];
};

export type PokeApiSpeciesResponse = {
  evolution_chain: {
    url: string;
  };
};

export type PokeApiEvolutionChainResponse = {
  chain: PokeApiEvolutionNode;
};
