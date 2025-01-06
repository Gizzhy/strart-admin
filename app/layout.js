import "./globals.css"; // Make sure to include your global CSS

export const metadata = {
  title: "Strart Admin Dashboard",
  description: "Managing products on the go",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
