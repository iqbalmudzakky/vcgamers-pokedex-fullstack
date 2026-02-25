"use client";

import { useCallback, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAtom } from "jotai";

import { PokemonCard } from "@/components/pokemon/pokemon-card";
import { getPokemonList } from "@/services/pokemon.services";
import { useDebounceValues } from "@/hooks/use-debounced-value";
import { PokemonCardSkeleton } from "@/components/pokemon/pokemon-card-skeleton";
import {
  pokemonItemsAtom,
  pokemonListStatusAtom,
  pokemonPaginationAtom,
  searchInputAtom,
} from "@/store/atoms/pokemon-list.atom";
import { ErrorState } from "@/components/common/error-state";

const LIMIT = 8;

export default function HomePage() {
  const [searchInput, setSearchInput] = useAtom(searchInputAtom);
  const debouncedSearch = useDebounceValues(searchInput, 400);

  const [items, setItems] = useAtom(pokemonItemsAtom);
  const [pagination, setPagination] = useAtom(pokemonPaginationAtom);
  const [status, setStatus] = useAtom(pokemonListStatusAtom);

  const { page, hasMore } = pagination;
  const { initialLoading, loadingMore, error } = status;

  const loadingFirstPage = useCallback(async () => {
    try {
      setStatus((prev) => ({ ...prev, initialLoading: true, error: "" }));
      setPagination((prev) => ({ ...prev, page: 1, hasMore: true }));

      const result = await getPokemonList({
        page: 1,
        limit: LIMIT,
        search: debouncedSearch.trim() || undefined,
      });

      setItems(result.items);
      setPagination((prev) => ({
        ...prev,
        page: 1,
        hasMore: result.pagination.hasMore,
      }));
    } catch (e) {
      console.error(e);
      setItems([]);
      setPagination((prev) => ({ ...prev, page: 1, hasMore: false }));
      setStatus((prev) => ({
        ...prev,
        error: "Failed to fetch pokemon list",
      }));
    } finally {
      setStatus((prev) => ({ ...prev, initialLoading: false }));
    }
  }, [debouncedSearch, setItems, setPagination, setStatus]);

  useEffect(() => {
    void loadingFirstPage();
  }, [loadingFirstPage]);

  async function fetchNextPage() {
    if (loadingMore || initialLoading || !hasMore) return;

    try {
      setStatus((prev) => ({ ...prev, loadingMore: true, error: "" }));

      const nextPage = page + 1;
      const result = await getPokemonList({
        page: nextPage,
        limit: LIMIT,
        search: debouncedSearch.trim() || undefined,
      });

      setItems((prev) => [...prev, ...result.items]);
      setPagination((prev) => ({
        ...prev,
        page: nextPage,
        hasMore: result.pagination.hasMore,
      }));
    } catch (e) {
      console.error(e);
      setStatus((prev) => ({ ...prev, error: "Failed to load more pokemon" }));
    } finally {
      setStatus((prev) => ({ ...prev, loadingMore: false }));
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
        <ErrorState
          title="Failed to Load Pokemon"
          message={error}
          onRetry={loadingFirstPage}
        />
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
