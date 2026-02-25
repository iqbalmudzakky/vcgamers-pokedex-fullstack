type Props = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: Props) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-center ">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded border border-red-300 bg-white px-3 py-1.5 text-sm hover:bg-red-100"
        >
          Retry
        </button>
      )}
    </div>
  );
}
