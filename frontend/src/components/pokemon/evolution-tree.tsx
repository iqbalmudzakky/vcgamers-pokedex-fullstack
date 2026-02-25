import type { EvolutionTree } from "@/types/pokemon";
import Link from "next/link";

type Props = {
  evolutionChain: EvolutionTree;
};

type EvolutionLevelItem = {
  name: string;
  imageUrl: string | null;
};

function collectLevels(
  evolutionChain: EvolutionTree,
  levelIndex: number,
  levels: EvolutionLevelItem[][],
) {
  if (!levels[levelIndex]) {
    levels[levelIndex] = [];
  }
  levels[levelIndex].push({
    name: evolutionChain.name,
    imageUrl: evolutionChain.imageUrl,
  });

  for (const next of evolutionChain.evolvesTo) {
    collectLevels(next, levelIndex + 1, levels);
  }
}

export function EvolutionTreeNode({ evolutionChain }: Props) {
  const levels: EvolutionLevelItem[][] = [];
  collectLevels(evolutionChain, 0, levels);

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-start gap-4 py-2">
        {levels.map((pokemonAtLevel, levelIndex) => (
          <div key={levelIndex} className="flex items-center gap-4">
            <div className="space-y-2">
              {pokemonAtLevel.map((pokemon, pokemonIndex) => (
                <Link
                  href={`/pokemon/${pokemon.name}`}
                  key={`${levelIndex}-${pokemon.name}-${pokemonIndex}`}
                  className="px-4 py-2 text-sm font-medium capitalize"
                >
                  {pokemon.imageUrl ? (
                    <img
                      src={pokemon.imageUrl}
                      alt={pokemon.name}
                      className="mx-auto mb-2 h-20 w-20 object-contain"
                    />
                  ) : (
                    <div className="mx-auto mb-2 h-16 w-16 rounded bg-slate-100" />
                  )}

                  <p className="text-center text-sm font-medium capitalize px-2 pb-2">
                    {pokemon.name}
                  </p>
                </Link>
              ))}
            </div>

            {levelIndex < levels.length - 1 && (
              <span className="text-xl text-slate-500">{"->"}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
