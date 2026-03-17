"use client";

import { useState, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import ControlPanel from "@/components/ControlPanel";
import { DEFAULT_CONFIG, type RoomConfig } from "@/lib/config";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Home() {
  const [config, setConfig] = useState<RoomConfig>(DEFAULT_CONFIG);

  const handleChange = useCallback(
    (key: keyof RoomConfig, value: string) => {
      setConfig((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return (
    <main className="relative w-screen h-screen">
      <Suspense
        fallback={
          <div className="flex items-center justify-center w-full h-full bg-gray-900 text-white text-lg">
            Загрузка 3D сцены...
          </div>
        }
      >
        <Scene config={config} />
      </Suspense>

      <ControlPanel config={config} onChange={handleChange} />
    </main>
  );
}
