"use client";

import { Label, Select, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CourseDto } from "@/dto/course.dto";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Header } from "@/component/Header";
import { SidebarAdmin } from "@/component/SideBarAdmin";
import { useForm, SubmitHandler } from "react-hook-form";

interface IFormInput {
  course: string;
}

export default function Component() {
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const router = useRouter();
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

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
  }, [router, session]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const response = await axios.get(`/api/enqueue?courseId=${data.course}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `course_${data.course}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="h-screen overflow-y-hidden">
      <Header />
      <div className="pt-20">
        <div className="flex h-screen overflow-y-auto sticky top-16">
          <SidebarAdmin />
          <div className="ml-4 w-3/4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-2 block">
                <Label
                  htmlFor="course"
                  value="Chọn Khóa Học"
                  className="font-bold text-lg"
                />
              </div>
              <Select id="course" {...register("course", { required: "Bạn phải chọn khóa học" })}>
                <option value="">Chọn Khóa Học</option>
                {courses.length === 0 ? (
                  <option value="">Không có khóa học nào</option>
                ) : (
                  courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))
                )}
              </Select>
              {errors.course && (
                <span className="text-red-500">{errors.course.message}</span>
              )}
              <Button type="submit" className="mt-4">
                Submit
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
