"use client";

import Link from "next/link";
import { Navbar } from "flowbite-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
interface HeaderProps {
  activeLink?: number;
}
export function Header({ activeLink }: HeaderProps) {
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
        <Navbar.Link active={activeLink === 1 || activeLink === undefined} onClick={() => router.push("/")}>
          Trang Chủ
        </Navbar.Link>
        <Navbar.Link active={activeLink === 2} onClick={() => router.push("/change-password")}>
          Đổi Mật Khẩu
        </Navbar.Link>
        {isAdmin && ( 
          <Navbar.Link active={activeLink === 3} onClick={() => router.push("/admin")}>
            Quản Trị
          </Navbar.Link>
        )}
        <Navbar.Link onClick={handleLogout}>Đăng xuất</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
