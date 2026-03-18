import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Конфигуратор комнаты",
  description: "Настройте интерьер комнаты онлайн",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
