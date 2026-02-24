"use client";

import { useEffect, useState } from "react";

import { PokemonCard } from "@/components/pokemon/pokemon-card";
import { PokemonListItem } from "@/types/pokemon";
import { getPokemonList } from "@/services/pokemon.services";
import { useDebounceValues } from "@/hooks/use-debounced-value";
import { PokemonCardSkeleton } from "@/components/pokemon/pokemon-card-skeleton";
import InfiniteScroll from "react-infinite-scroll-component";

const LIMIT = 8;

export default function HomePage() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounceValues(searchInput, 400);

  const [items, setItems] = useState<PokemonListItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadingFirstPage() {
      try {
        setInitialLoading(true);
        setError("");
        setPage(1);

        const result = await getPokemonList({
          page: 1,
          limit: LIMIT,
          search: debouncedSearch.trim() || undefined,
        });

        if (!active) return;
        setItems(result.items);
        setHasMore(result.pagination.hasMore);
      } catch (e) {
        if (!active) return;
        console.error("🚀 ~ loadingFirstPage ~ e:", e);
        setError("Failed to fecth pokemon list");
        setItems([]);
        setHasMore(false);
      } finally {
        if (active) setInitialLoading(false);
      }
    }

    loadingFirstPage();

    return () => {
      active = false;
    };
  }, [debouncedSearch]);

  async function fetchNextPage() {
    if (loadingMore || initialLoading || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;

      const result = await getPokemonList({
        page: nextPage,
        limit: LIMIT,
        search: debouncedSearch.trim() || undefined,
      });

      setItems((prev) => [...prev, ...result.items]);
      setPage(nextPage);
      setHasMore(result.pagination.hasMore);
    } catch (e) {
      console.error("🚀 ~ HomePage ~ e:", e);
      setError("Failed to load more pokemon");
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Pokedex</h1>

      <input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search pokemon..."
        className="mb-4 w-full rounded border px-3 py-2"
      />

      {initialLoading ? (
        <section className="grid grid-cols-2 gap-4">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <PokemonCardSkeleton key={i} />
          ))}
        </section>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : items.length === 0 ? (
        <p>No pokemon found</p>
      ) : (
        <InfiniteScroll
          dataLength={items.length}
          next={fetchNextPage}
          hasMore={hasMore}
          loader={
            <section className="mt-4 grid grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <PokemonCardSkeleton key={`more-${i}`} />
              ))}
            </section>
          }
          endMessage={
            <p className="py-4 text-center text-sm text-slate-500">
              No more pokemon to load.
            </p>
          }
        >
          <section className="grid grid-cols-2 gap-4">
            {items.map((pokemon) => (
              <PokemonCard
                key={`${pokemon.pokemonId}-${pokemon.name}`}
                pokemon={pokemon}
              />
            ))}
          </section>
        </InfiniteScroll>
      )}
    </main>
  );
}
