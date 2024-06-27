"use client";

import Link from "next/link";
import { Navbar } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: number; email: string; name: string; role: string } | null>(null);

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    const sessionCookie = getCookie('session');
    console.log(sessionCookie);
    if (sessionCookie) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(sessionCookie));
        setUser(sessionData);
      } catch (error) {
        console.error("Failed to parse session cookie:", error);
      }
    }
  }, []);

  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    // signOut({ callbackUrl: "/login" });
  };

  return (
    <Navbar fluid rounded className="fixed top-0 w-full z-50">
      <Navbar.Brand>
        <img
          src="/img/logo.png"
          className="mr-3 sm:h-9"
          alt="Flowbite React Logo"
          onClick={() => router.push("/")}
        />
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="cursor-pointer">
        <Navbar.Link active onClick={() => router.push("/")}>
          Trang Chủ
        </Navbar.Link>
        {isAdmin && ( 
          <Navbar.Link onClick={() => router.push("/admin")}>
            Quản Trị
          </Navbar.Link>
        )}
        <Navbar.Link onClick={handleLogout}>Đăng xuất</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
