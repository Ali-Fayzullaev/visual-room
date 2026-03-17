export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-900 text-white">
      <h2 className="text-xl font-bold mb-4">Страница не найдена</h2>
      <a href="/" className="text-blue-400 hover:underline">
        Вернуться на главную
      </a>
    </div>
  );
}
