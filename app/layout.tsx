"use client";

import "./globals.css";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  // ✅ path ที่ต้องการซ่อน navbar แบบเจาะจง
  const noNavbarPaths = ["/productsearch", "/projectdetail", "/brands"];

  // ✅ ซ่อน navbar เมื่อ path เป็น /admin หรือ /admin/*
  const hideNavbar =
    noNavbarPaths.includes(pathname) || pathname.startsWith("/admin");

  return (
    <html>
      <body className="bg-white relative">
        {/* ✅ แสดงเฉพาะหน้าที่ไม่ซ่อน */}
        {!hideNavbar && (
          <div className="absolute top-0 left-0 w-full z-50 bg-transparent">
            <Navbar />
          </div>
        )}

        {/* ✅ เนื้อหาหลัก */}
        <main className="w-full">
          {children}
        </main>

        {/* ✅ Footer ยังแสดงทุกหน้า */}
        <Footer />
      </body>
    </html>
  );
};

export default Layout;
