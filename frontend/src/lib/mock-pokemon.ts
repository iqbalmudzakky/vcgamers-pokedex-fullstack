import type { PokemonDetail, PokemonListItem } from "@/types/pokemon";

export const mockPokemonList: PokemonListItem[] = [
  {
    pokemonId: 1,
    name: "bulbasaur",
    height: 7,
    weight: 69,
    sprites: {
      front_default:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
      back_default:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png",
      front_shiny:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png",
    },
    types: [{ slot: 1, type: { name: "grass", url: "" } }],
  },
  {
    pokemonId: 4,
    name: "charmander",
    height: 6,
    weight: 85,
    sprites: {
      front_default:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
      back_default:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png",
      front_shiny:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/4.png",
    },
    types: [{ slot: 1, type: { name: "fire", url: "" } }],
  },
];

export const mockPokemonDetailByName: Record<string, PokemonDetail> = {
  bulbasaur: {
    ...mockPokemonList[0],
    moves: Array.from({ length: 10 }).map((_, i) => ({
      move: { name: `move-${i + 1}`, url: "" },
    })),
    evolutionChain: {
      name: "bulbasaur",
      evolvesTo: [
        { name: "ivysaur", evolvesTo: [{ name: "venusaur", evolvesTo: [] }] },
      ],
    },
  },
  charmander: {
    ...mockPokemonList[1],
    moves: Array.from({ length: 10 }).map((_, i) => ({
      move: { name: `move-${i + 1}`, url: "" },
    })),
    evolutionChain: {
      name: "charmander",
      evolvesTo: [
        {
          name: "charmeleon",
          evolvesTo: [{ name: "charizard", evolvesTo: [] }],
        },
      ],
    },
  },
};
