import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "School of Scholars | Official Store & Merchandise Portal",
  description: "Official online store for School of Scholars. Purchase CBSE/NCERT textbook sets, uniforms, blazers, stationery, and school accessories with home delivery or campus pickup.",
  keywords: ["School of Scholars", "School Uniform", "NCERT Books", "School Books", "School Bag", "CBSE Syllabus"]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col justify-between overflow-x-hidden w-full">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
