import { PokeApiEvolutionNode } from "../types/pokeapi";

type EvolutionTree = {
  name: string;
  evolvesTo: EvolutionTree[];
};

export function mapEvolutionNode(node: PokeApiEvolutionNode): EvolutionTree {
  return {
    name: node.species.name,
    evolvesTo: node.evolves_to.map(mapEvolutionNode),
  };
}
