"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "flowbite-react";
import { SidebarAdmin } from "@/component/SideBarAdmin";
import { format } from "date-fns";
import { CourseDto } from "@/dto/course.dto";
import { useRouter } from "next/navigation";
import { Header } from "@/component/Header";
import { useSession } from "next-auth/react";

export default function Courses() {
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    if (!session || session.user.role !== "admin") {
      router.push("/");
      return;
    }
    async function fetchData() {
      try {
        const res = await axios.get("/api/courses");
        setCourses(res.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }
    fetchData();
  }, []);
  const handleEdit = (id: number) => {
    router.push(`/courses/${id}`);
  };
  return (
    <div className="h-screen overflow-y-hidden">
      <Header />
      <div className="pt-20">
        <div className="flex h-screen overflow-y-auto sticky top-16">
          <SidebarAdmin />
          <div className="overflow-x-auto table-w-80 mx-auto">
            <Table>
              <Table.Head>
                <Table.HeadCell>Tên Khóa Học</Table.HeadCell>
                <Table.HeadCell>Thứ tự hiện thị</Table.HeadCell>
                <Table.HeadCell>Ngày Cập Nhật</Table.HeadCell>
                <Table.HeadCell>
                  <span className="sr-only">Edit</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {courses.length > 0 &&
                  courses?.map((course) => (
                    <Table.Row
                      key={course.id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {course.title}
                      </Table.Cell>
                      <Table.Cell>{course.display_order}</Table.Cell>
                      <Table.Cell>
                        {" "}
                        {course.updated_at
                          ? format(new Date(course.updated_at), "dd/MM/yyyy")
                          : ""}
                      </Table.Cell>
                      <Table.Cell>
                        <a
                          onClick={() => handleEdit(course.id)}
                          className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                        >
                          Sửa
                        </a>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                {courses.length === 0 && (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell colSpan={5} className="text-center">
                      Không có dữ liệu
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
