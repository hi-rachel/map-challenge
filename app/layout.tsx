import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "유어픽 지도",
  description: "유어픽 지도 구현",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NAVER}`}
      />
    </html>
  );
};

export default RootLayout;
