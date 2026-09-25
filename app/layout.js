import { Anton, Work_Sans } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const workSans = Work_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
});

export const metadata = {
  title: "Mineiro, o Barbeiro — Centro, Piracicaba",
  description:
    "Degradê, barba desenhada e freestyle com o Mineiro. Primeira visita com 50% de desconto.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mineiro",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#14100c",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${workSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
