"use client";

import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { getPokemonDetail } from "@/services/pokemon.services";
import {
  pokemonDetailAtom,
  pokemonDetailStatusAtom,
} from "@/store/atoms/pokemon-detail.atom";
import { EvolutionTreeNode } from "@/components/pokemon/evolution-tree";
import { ErrorState } from "@/components/common/error-state";

export default function PokemonDetailPage() {
  const params = useParams<{ name: string }>();
  const name = String(params.name || "");

  const [detail, setDetail] = useAtom(pokemonDetailAtom);
  const [status, setStatus] = useAtom(pokemonDetailStatusAtom);

  const loadPage = useCallback(async () => {
    try {
      setStatus((prev) => ({ ...prev, loading: true, error: "" }));

      const result = await getPokemonDetail(name);

      setDetail(result);
    } catch (e) {
      console.error(e);
      setDetail(null);
      setStatus((prev) => ({ ...prev, error: "Pokemon not found" }));
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  }, [name, setDetail, setStatus]);

  useEffect(() => {
    void loadPage();
  }, [loadPage]);

  if (status.loading) {
    return (
      <main className="mx-auto max-w-4xl p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-40 rounded bg-slate-200" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-28 rounded bg-slate-200" />
            <div className="h-28 rounded bg-slate-200" />
            <div className="h-28 rounded bg-slate-200" />
          </div>
          <div className="h-5 w-52 rounded bg-slate-200" />
          <div className="h-5 w-56 rounded bg-slate-200" />
          <div className="h-5 w-64 rounded bg-slate-200" />
          <div className="h-24 rounded bg-slate-200" />
        </div>
      </main>
    );
  }

  if (status.error || !detail) {
    return (
      <main className="min-h-screen px-4">
        <div className="mx-auto grid min-h-screen max-w-4xl place-items-center">
          <div className="w-full max-w-2xl">
            <ErrorState
              title="Failed to Load Pokemon"
              message={status.error}
              onRetry={loadPage}
            />
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-4xl p-4">
      <Link
        href="/"
        className="mb-4 inline-flex items-center rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
      >
        {"<- Back to List"}
      </Link>

      <h1 className="mb-4 text-2xl font-bold capitalize">{detail.name}</h1>

      <section className="mb-4 grid grid-cols-3 gap-4">
        <Image
          src={detail.sprites.front_default ?? ""}
          alt={`${detail.name} front`}
          width={96}
          height={96}
          className="h-24 w-24 object-contain"
        />
        <Image
          src={detail.sprites.back_default ?? ""}
          alt={`${detail.name} back`}
          width={96}
          height={96}
          className="h-24 w-24 object-contain"
        />
        <Image
          src={detail.sprites.front_shiny ?? ""}
          alt={`${detail.name} shiny`}
          width={96}
          height={96}
          className="h-24 w-24 object-contain"
        />
      </section>

      <section className="space-y-2">
        <p>Height: {(detail.height / 10).toFixed(1)} m</p>
        <p>Weight: {(detail.weight / 10).toFixed(1)} kg</p>
        <p>Types: {detail.types.map((t) => t.type.name).join(", ")}</p>

        <div className="mt-4">
          <h2 className="mb-2 text-lg font-semibold">Moves (max 10)</h2>
          <div className="flex flex-wrap gap-2">
            {detail.moves.map((m) => (
              <span
                key={m.move.name}
                className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm capitalize hover:bg-slate-50"
              >
                {m.move.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-lg font-semibold">Evolution Chain</h2>
        <EvolutionTreeNode evolutionChain={detail.evolutionChain} />
      </section>
    </main>
  );
}
