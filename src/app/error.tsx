"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-900 text-white">
      <h2 className="text-xl font-bold mb-4">Что-то пошло не так</h2>
      <p className="text-white/60 mb-6">{error.message}</p>
      <button
        onClick={reset}
        className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
      >
        Попробовать снова
      </button>
    </div>
  );
}
