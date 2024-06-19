"use client";

import { Sidebar } from "flowbite-react";
import { useRouter } from "next/navigation";

export function SidebarAdmin() {
  const router = useRouter();

  return (
    <Sidebar aria-label="Default sidebar example">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Collapse label="Quản Lý Khóa Học" className='font-bold' >

          <Sidebar.Item onClick={() => router.push("/courses")} className=" cursor-pointer">
              Danh Sách Khóa Học
            </Sidebar.Item>
            <Sidebar.Item onClick={() => router.push("/courses/create")}  className=" cursor-pointer">
              Thêm Khóa Học
            </Sidebar.Item>
          </Sidebar.Collapse>

          <Sidebar.Collapse label="Quản Lý Video" className='font-bold'> 
          <Sidebar.Item  onClick={() => router.push("/videos")}  className=" cursor-pointer">
              Danh Sách Video
            </Sidebar.Item>
            <Sidebar.Item  onClick={() => router.push("/videos/create")} className=" cursor-pointer">
              Thêm Video
            </Sidebar.Item>
          </Sidebar.Collapse>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
