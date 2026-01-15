import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  weight: ["300", "400", "600", "800"],
  subsets: ["latin", "thai"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Media Planner Assistant - Midnight Enterprise v2",
  description: "วิเคราะห์จัดสรรงบประมาณสื่อด้วยตรรกะระดับ Senior Planner เพื่อเป้าหมาย Ecommerce Conversion ที่วัดผลได้จริง",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${prompt.className} antialiased`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
