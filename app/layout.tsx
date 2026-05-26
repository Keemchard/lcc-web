// import type { Metadata } from "next";
// import { Inter, Poppins } from "next/font/google";
// import "./globals.scss";

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-body",
// });

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   variable: "--font-heading",
// });

// export const metadata: Metadata = {
//   title: "LCC Church",
//   description: "Modern Church Website",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html
//       lang="en"
//       className={`${inter.variable} ${poppins.variable} h-full antialiased`}
//     >
//       <body>{children}</body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.scss";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "LCC Church",
  description: "Modern Church Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}
