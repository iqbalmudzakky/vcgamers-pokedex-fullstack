import { PokeApiEvolutionNode } from "../types/pokeapi";
import { EvolutionTree } from "../types/pokemon";

// export function mapEvolutionNode(node: PokeApiEvolutionNode): EvolutionTree {
//   return {
//     name: node.species.name,
//     evolvesTo: node.evolves_to.map(mapEvolutionNode),
//   };
// }

export function collectEvolutionName(
  node: PokeApiEvolutionNode,
  names: Set<string>,
) {
  names.add(node.species.name.toLowerCase());
  for (const next of node.evolves_to) {
    collectEvolutionName(next, names);
  }
}

export function mapEvolutionWithImage(
  node: PokeApiEvolutionNode,
  spriteMap: Record<string, string | null>,
): EvolutionTree {
  const key = node.species.name.toLowerCase();

  return {
    name: node.species.name,
    imageUrl: spriteMap[key] ?? null,
    evolvesTo: node.evolves_to.map((next) =>
      mapEvolutionWithImage(next, spriteMap),
    ),
  };
}
