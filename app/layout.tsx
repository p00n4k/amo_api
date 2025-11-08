"use client";

import "./globals.css";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const noNavbarPaths = ["/productsearch", "/admin", "/projectdetail"];
  const hideNavbar = noNavbarPaths.includes(pathname);

  return (
    <html>
      <body className="bg-white relative">
        {/* ✅ Navbar ซ้อน page ได้ แต่ไม่เลื่อนตาม */}
        {!hideNavbar && (
          <div className="absolute top-0 left-0 w-full z-50 bg-transparent">
            <Navbar />
          </div>
        )}

        {/* ✅ ให้เนื้อหาข้างล่างไม่โดนทับ ถ้ามีภาพพื้นหลังจะเห็น Navbar ซ้อนอยู่ */}
        <main className="w-full">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
};

export default Layout;
