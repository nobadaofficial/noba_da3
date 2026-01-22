import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nobada - AI 연애 시뮬레이션",
  description: "실사 영상과 실시간 음성으로 만나는 차세대 AI 캐릭터 대화 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}