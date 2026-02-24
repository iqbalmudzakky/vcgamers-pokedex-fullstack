import { ApiResponse, PokemonDetail, PokemonListData } from "@/types/pokemon";
import { api } from "./api";

type GetPokemonListParams = {
  page: number;
  limit: number;
  search?: string;
};

export async function getPokemonList(params: GetPokemonListParams) {
  const { data } = await api.get<ApiResponse<PokemonListData>>("/pokemon", {
    params,
  });
  return data.data;
}

export async function getPokemonDetail(name: string) {
  const { data } = await api.get<ApiResponse<PokemonDetail>>(
    `/pokemon/${name}`,
  );
  return data.data;
}
