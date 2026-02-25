import axios from "axios";
import { findPokemonByName } from "../repositories/pokemon.repository";
import type {
  PokeApiEvolutionChainResponse,
  PokeApiSpeciesResponse,
} from "../types/pokeapi";
import { syncPokemonByName } from "./pokemon-sync.service";
import {
  collectEvolutionName,
  mapEvolutionWithImage,
} from "../mappers/evolution.mapper";

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

  const { data: evolutionData } =
    await axios.get<PokeApiEvolutionChainResponse>(
      speciesData.evolution_chain.url,
    );

  const nameSet = new Set<string>();
  collectEvolutionName(evolutionData.chain, nameSet);
  const evolutionNames = Array.from(nameSet);

  const spriteMap: Record<string, string | null> = {};

  for (const evoName of evolutionNames) {
    let evoPokemon = await findPokemonByName(evoName);

    if (!evoPokemon) {
      try {
        await syncPokemonByName(evoName);
        evoPokemon = await findPokemonByName(evoName);
      } catch (error) {
        console.log(error);
        evoPokemon = null;
      }
    }

    spriteMap[evoName] = evoPokemon?.sprites.front_default ?? null;
  }

  const evolutionChain = mapEvolutionWithImage(evolutionData.chain, spriteMap);

  return {
    pokemonId: pokemon.pokemonId,
    name: pokemon.name,
    height: pokemon.height,
    weight: pokemon.weight,
    sprites: pokemon.sprites,
    types: pokemon.types,
    moves: pokemon.moves.slice(0, 10),
    evolutionChain,
  };
}
