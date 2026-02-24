export type PokemonListItem = {
  name: string;
  url: string;
};

export type PokemonTypeItem = {
  slot: number;
  type: PokemonListItem;
};

export type PokemonMoveItem = {
  move: PokemonListItem;
};

export type PokemonSprites = {
  front_default: string | null;
  back_default: string | null;
  front_shiny: string | null;
};

export type PokemonDocument = {
  pokemonId: number;
  name: string;
  height: number;
  weight: number;
  sprites: PokemonSprites;
  types: PokemonTypeItem[];
  moves: PokemonMoveItem[];
  speciesUrl: string;
  updatedAt: Date;
};
