export function PokemonCardSkeleton() {
  return (
    <div className="rounded-lg border p-4 animate-pulse">
      <div className="h-20 w-20 rounded bg-slate-200" />
      <div className="mt-3 h-4 w-24 rounded bg-slate-200" />
      <div className="mt-2 h-3 w-32 rounded bg-slate-200" />
    </div>
  );
}
