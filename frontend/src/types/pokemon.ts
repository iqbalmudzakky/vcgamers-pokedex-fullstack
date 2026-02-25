export type PokemonNamedResource = {
  name: string;
  url: string;
};

export type PokemonSprites = {
  front_default: string | null;
  back_default: string | null;
  front_shiny: string | null;
};

export type PokemonTypeItem = {
  slot: number;
  type: PokemonNamedResource;
};

export type PokemonMoveItem = {
  move: PokemonNamedResource;
};

export type PokemonListItem = {
  pokemonId: number;
  name: string;
  height: number;
  weight: number;
  sprites: PokemonSprites;
  types: PokemonTypeItem[];
};

export type EvolutionTree = {
  name: string;
  imageUrl: string | null;
  evolvesTo: EvolutionTree[];
};

export type PokemonDetail = PokemonListItem & {
  moves: PokemonMoveItem[];
  evolutionChain: EvolutionTree;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export type PokemonListData = {
  items: PokemonListItem[];
  pagination: PaginationMeta;
};

export type ApiResponse<T> = {
  ok: boolean;
  message: string;
  data: T;
};
