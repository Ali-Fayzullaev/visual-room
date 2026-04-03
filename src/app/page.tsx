import Link from "next/link";

/* ── Room catalog data ── */
const ROOMS = [
  {
    id: "kitchen-3d",
    name: "Современная кухня",
    description: "3D визуализация кухни с настройкой фасадов, столешницы, фартука и фурнитуры",
    preview: "/kitchen.png",
    zones: 5,
    badge: "3D",
  },
  {
    id: "bedroom-1",
    name: "Спальня 1",
    description: "Стены, пол, кровать, постельное бельё, шторы, мебель и ковёр",
    preview: "/bedroom1.png",
    zones: 7,
    badge: "3D",
  },
  {
    id: "bedroom-2",
    name: "Спальня 2",
    description: "Мрамор, каркас кровати, постельное бельё, шторы, ковёр и декор",
    preview: "/bedroom2.png",
    zones: 6,
    badge: "3D",
  },
  {
    id: "kitchen-2",
    name: "Кухня 2",
    description: "Тестовая 3D-модель с быстрой сменой декора всей сцены",
    preview: "/kitchen2.png",
    zones: 1,
    badge: "3D",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <header className="relative bg-gradient-to-br from-red-600 via-red-500 to-red-700 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/30">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Visual Room
              </h1>
              <p className="text-red-100 text-xs sm:text-sm">
                Визуализатор интерьеров
              </p>
            </div>
          </div>
          <p className="text-white/80 text-sm sm:text-base max-w-xl leading-relaxed">
            Выберите интерьер и настройте материалы в реальном времени.
            Нажимайте на поверхности для мгновенной смены декоров.
          </p>
        </div>
      </header>

      {/* ── Room catalog ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Интерьеры
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {ROOMS.length} {ROOMS.length === 1 ? "комната" : "комнат"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {ROOMS.map((room) => (
            <Link
              key={room.id}
              href={`/${room.id}`}
              className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-red-100 transition-all duration-300"
            >
              {/* Preview image */}
              <div className="aspect-[16/10] overflow-hidden bg-gray-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={room.preview}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* 3D badge */}
                {room.badge && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-600 px-2.5 py-1 rounded-full shadow-lg">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V15m0 0l-2.25 1.313" />
                    </svg>
                    <span className="text-white text-[10px] font-bold uppercase tracking-wider">{room.badge}</span>
                  </div>
                )}

                {/* Zone count */}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-gray-700 font-medium">
                  {room.zones} {room.zones === 1 ? "зона" : "зон"}
                </div>
              </div>

              {/* Card body */}
              <div className="p-4 sm:p-5">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
                  {room.name}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm mb-4 line-clamp-2">
                  {room.description}
                </p>
                <div className="flex items-center justify-end">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    Открыть
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* Add new room placeholder */}
          <div className="group relative bg-gray-50 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-red-300 transition-colors flex items-center justify-center min-h-[280px]">
            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-100 group-hover:bg-red-50 flex items-center justify-center transition-colors">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                Скоро новые интерьеры
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
          <p className="text-gray-400 text-xs">Visual Room • Next.js + Three.js</p>
          <p className="text-gray-300 text-[10px]">v3.0</p>
        </div>
      </footer>
    </main>
  );
}
