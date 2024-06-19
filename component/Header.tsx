"use client";

import Link from "next/link";
import { Navbar } from "flowbite-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
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
        {/* <Navbar.Link href="#">Khóa Học Của Tôi</Navbar.Link> */}
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
