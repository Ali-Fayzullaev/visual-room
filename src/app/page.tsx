import Link from "next/link";
import { getAllRooms } from "@/lib/config";

export default function Home() {
  const rooms = getAllRooms();

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-gray-950 to-gray-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-8 sm:pb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                2D конфигуратор интерьера
              </h1>
              <p className="text-white/40 text-xs sm:text-sm tracking-wide">
                Настраивайте цвета и текстуры на фото комнаты, без 3D
              </p>
            </div>
          </div>

          <p className="text-white/50 text-sm sm:text-base max-w-2xl leading-relaxed">
            Выберите комнату и настройте покрытия — стены, полы, мебель.
            Результат отображается мгновенно на фотореалистичном изображении.
          </p>
        </div>
      </header>

      {/* Room catalog */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Выбрать интерьер</h2>
            <p className="text-white/40 text-sm mt-1">
              {rooms.length} {rooms.length === 1 ? "комната" : rooms.length < 5 ? "комнаты" : "комнат"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {rooms.map((room) => (
            <Link
              key={room.id}
              href={`/room/${room.id}`}
              className="
                group relative rounded-2xl overflow-hidden
                border transition-all duration-300
                border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]
              "
            >
              {/* Preview */}
              <div className="aspect-video overflow-hidden bg-gray-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={room.preview}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent" />
              </div>

              {/* Info */}
              <div className="p-4 sm:p-5">
                <h3 className="font-bold text-base sm:text-lg mb-1 group-hover:text-blue-300 transition-colors">
                  {room.name}
                </h3>
                <p className="text-white/45 text-xs sm:text-sm mb-3 line-clamp-2">
                  {room.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-white/25 text-xs">
                    {room.zoneCount} {room.zoneCount === 1 ? "зона" : "зон"}
                  </span>
                  <span className="
                    text-xs font-medium px-3 py-1.5 rounded-full transition-colors
                    bg-white/5 text-white/50 border border-white/10 group-hover:bg-white/10
                  ">
                    Настроить →
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* Placeholder */}
          <div className="
            flex flex-col items-center justify-center
            rounded-2xl border-2 border-dashed border-white/[0.06]
            aspect-video sm:aspect-auto sm:min-h-[280px]
            text-white/15
          ">
            <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="text-sm">Скоро новые интерьеры</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] mt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
          <p className="text-white/20 text-xs">Визуализатор интерьера • Next.js</p>
          <p className="text-white/15 text-[10px]">v2.0</p>
        </div>
      </footer>
    </main>
  );
}
