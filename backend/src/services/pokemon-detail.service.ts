import axios from "axios";
import { findPokemonByName } from "../repositories/pokemon.repository";
import {
  PokeApiEvolutionChainResponse,
  PokeApiEvolutionNode,
  PokeApiSpeciesResponse,
} from "../types/pokeapi";
import { syncPokemonByName } from "./pokemon-sync.service";
import { mapEvolutionNode } from "../mappers/evolution.mapper";

export async function getPokemonDetail(name: string) {
  let pokemon = await findPokemonByName(name);

  if (!pokemon) {
    await syncPokemonByName(name);
    pokemon = await findPokemonByName(name);
  }

  if (!pokemon) {
    throw new Error("Pokemon not found");
  }

  const { data: speciesData } = await axios.get<PokeApiSpeciesResponse>(
    pokemon.speciesUrl,
  );
  // console.log("🚀 ~ getPokemonDetail ~ speciesData:", speciesData);

  const { data: evolutionData } =
    await axios.get<PokeApiEvolutionChainResponse>(
      speciesData.evolution_chain.url,
    );

  return {
    pokemonId: pokemon.pokemonId,
    name: pokemon.name,
    height: pokemon.height,
    weight: pokemon.weight,
    sprites: pokemon.sprites,
    types: pokemon.types,
    moves: pokemon.moves.slice(0, 10),
    evolutionChain: mapEvolutionNode(evolutionData.chain),
  };
}
