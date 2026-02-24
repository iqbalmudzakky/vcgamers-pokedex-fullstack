import Link from "next/link";

import type { PokemonListItem } from "@/types/pokemon";

type Props = {
  pokemon: PokemonListItem;
};

export function PokemonCard({ pokemon }: Props) {
  return (
    <Link
      href={`/pokemon/${pokemon.name}`}
      className="rounded-lg border p-4 hover:bg-gray-50 transition"
    >
      <img
        src={pokemon.sprites.front_default ?? ""}
        alt={pokemon.name}
        className="h-20 w-20 object-contain"
      />
      <p className="mt-2 font-semibold capitalize">{pokemon.name}</p>
      <p className="text-sm text-gray-600">
        Types: {pokemon.types.map((t) => t.type.name).join(", ")}
      </p>
    </Link>
  );
}
