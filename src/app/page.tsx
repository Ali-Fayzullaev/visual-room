import Link from "next/link";
import { ROOMS } from "@/lib/config";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Шапка */}
      <header className="border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg">
            🏠
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-wide">Конфигуратор интерьера</h1>
            <p className="text-white/40 text-[10px] sm:text-xs tracking-wider">ВЫБЕРИТЕ КОМНАТУ</p>
          </div>
        </div>
      </header>

      {/* Каталог комнат */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Выбрать интерьер</h2>
        <p className="text-white/50 text-sm mb-6 sm:mb-8">
          {ROOMS.length} {ROOMS.length === 1 ? "вариант" : "вариантов"} для настройки
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {ROOMS.map((room) => (
            <Link
              key={room.id}
              href={`/room/${room.id}`}
              className="
                group relative rounded-2xl overflow-hidden
                border border-white/[0.08] bg-white/[0.02]
                hover:border-white/20 hover:bg-white/[0.05]
                transition-all duration-300
              "
            >
              {/* Превью */}
              <div className="aspect-video overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={room.preview}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Инфо */}
              <div className="p-4">
                <h3 className="font-bold text-base sm:text-lg mb-1">{room.name}</h3>
                <p className="text-white/50 text-xs sm:text-sm mb-3">{room.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white/30 text-xs">
                    {room.zones.length} {room.zones.length === 1 ? "зона" : "зон"} для настройки
                  </span>
                  <span className="
                    text-xs font-medium px-3 py-1 rounded-full
                    bg-blue-500/10 text-blue-400 border border-blue-500/20
                    group-hover:bg-blue-500/20 transition-colors
                  ">
                    Настроить →
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* Placeholder для будущих комнат */}
          <div className="
            flex flex-col items-center justify-center
            rounded-2xl border-2 border-dashed border-white/10
            aspect-video sm:aspect-auto sm:min-h-[280px]
            text-white/20
          ">
            <span className="text-4xl mb-2">+</span>
            <span className="text-sm">Скоро новые интерьеры</span>
          </div>
        </div>
      </section>
    </main>
  );
}
