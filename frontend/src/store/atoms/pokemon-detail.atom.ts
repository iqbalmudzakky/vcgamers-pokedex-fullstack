import { atom } from "jotai";

import type { PokemonDetail } from "@/types/pokemon";

type PokemonDetailStatus = {
  loading: boolean;
  error: string;
};

export const pokemonDetailAtom = atom<PokemonDetail | null>(null);
export const pokemonDetailStatusAtom = atom<PokemonDetailStatus>({
  loading: true,
  error: "",
});
