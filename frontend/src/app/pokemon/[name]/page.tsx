"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";

import { mockPokemonDetailByName } from "@/lib/mock-pokemon";
import { PokemonDetail } from "@/types/pokemon";
import { getPokemonDetail } from "@/services/pokemon.services";

export default function PokemonDetailPage() {
  const params = useParams<{ name: string }>();
  const name = params.name;

  const [data, setData] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function run() {
      try {
        setLoading(true);
        setError("");
        const result = await getPokemonDetail(name);
        if (!active) return;
        setData(result);
        console.log("🚀 ~ run ~ result:", result.moves);
      } catch (e) {
        if (!active) return;
        console.error("🚀 ~ run ~ e:", e);
        setError("Pokemon not found");
      } finally {
        if (active) setLoading(false);
      }
    }

    run();

    return () => {
      active = false;
    };
  }, [name]);

  if (loading) return <main className="p-4">Loading...</main>;
  if (error || !data) return <main className="p-4 text-red-600">{error}</main>;

  return (
    <main className="mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-2xl font-bold capitalize">{data.name}</h1>

      <section className="mb-4 grid grid-cols-3 gap-4">
        <img
          src={data.sprites.front_default ?? ""}
          alt={`${data.name} front`}
        />
        <img src={data.sprites.back_default ?? ""} alt={`${data.name} back`} />
        <img src={data.sprites.front_shiny ?? ""} alt={`${data.name} shiny`} />
      </section>

      <p>Height: {data.height}</p>
      <p>Weight: {data.weight}</p>
      <p>Types: {data.types.map((t) => t.type.name).join(", ")}</p>
      <p>Moves (max 10): {data.moves.map((m) => m.move.name).join(", ")}</p>
      <p>Evolution root: {data.evolutionChain.name}</p>
    </main>
  );
}
