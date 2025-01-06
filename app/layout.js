import "./globals.css"; // Make sure to include your global CSS
import { Poppins } from "@next/font/google";

const poppins = Poppins({
  subsets: ["latin"], // You can add other subsets if needed
  weight: ["400", "500", "600", "700"], // Add font weights as required
  style: ["normal"], // You can also include 'italic' if necessary
});

export const metadata = {
  title: "Strart Admin Dashboard",
  description: "Managing products on the go",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.className}>
      <body>{children}</body>
    </html>
  );
}
