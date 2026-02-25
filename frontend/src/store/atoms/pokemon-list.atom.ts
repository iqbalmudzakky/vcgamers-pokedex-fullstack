import { atom } from "jotai";

import { PokemonListItem } from "@/types/pokemon";

type PokemonListStatus = {
  initialLoading: boolean;
  loadingMore: boolean;
  error: string;
};

type PokemonListPagination = {
  page: number;
  hasMore: boolean;
};

export const searchInputAtom = atom("");
export const pokemonItemsAtom = atom<PokemonListItem[]>([]);
export const pokemonPaginationAtom = atom<PokemonListPagination>({
  page: 1,
  hasMore: true,
});
export const pokemonListStatusAtom = atom<PokemonListStatus>({
  initialLoading: true,
  loadingMore: false,
  error: "",
});
