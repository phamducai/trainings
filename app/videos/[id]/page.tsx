"use client";

import { SidebarAdmin } from "@/component/SideBarAdmin";
import { CourseDto } from "@/dto/course.dto";
import axios from "axios";
import { Button, Label, TextInput, Textarea, Select } from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/component/Header";

type FormValues = {
  title: string;
  course_id: string;
  description: string;
  display_order: number;
};

const EditVideo: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>();
  const [message, setMessage] = useState<string | null>(null);
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await axios.get("/api/courses");
        setCourses(res.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }

    async function fetchVideoDetails() {
      if (id) {
        try {
          const res = await axios.get(`/api/videos/${id}`);
          const video = res.data;
          console.log("Fetched video details:", video);

          setValue("title", video.title);
          setValue("course_id", video.course_id);
          setValue("description", video.description);
          setValue("display_order", video.display_order);
        } catch (error) {
          console.error("Error fetching video details:", error);
        }
      }
    }

    fetchCourses();
    fetchVideoDetails();
  }, [id, setValue]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data);
    try {
      await axios.put(`/api/videos/${id}`, data);
      router.push("/videos");
    } catch (error) {
      console.error("Error updating video:", error);
      setMessage("Error updating video.");
    }
  };

  return (
    <div className="">
      <Header />
      <div className="mt-16 mb-20">
        <div className="flex">
          <SidebarAdmin />
          <div className="w-3/4 mx-auto">
            <h1 className="text-2xl font-bold mb-4">Chỉnh Sửa Video</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-md flex-col gap-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="title" value="Tiêu Đề Video" />
                </div>
                <TextInput
                  id="title"
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  shadow
                />
                {errors.title && <p className="text-red-600">{errors.title.message}</p>}
              </div>
              
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="course_id" value="Khóa Học" />
                </div>
                <Controller
                  name="course_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="course_id"
                      {...field}
                    >
                      <option value="">Chọn Khóa Học</option>
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.title}</option>
                      ))}
                    </Select>
                  )}
                />
                {errors.course_id && <p className="text-red-600">{errors.course_id.message}</p>}
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="display_order" value="Thứ Tự Hiện Thị" />
                </div>
                <TextInput
                  id="display_order"
                  type="number"
                  {...register("display_order", { required: "Display Order is required" })}
                  shadow
                />
                {errors.display_order && <p className="text-red-600">{errors.display_order.message}</p>}
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="description" value="Mô tả" />
                </div>
                <Textarea
                  id="description"
                  className="h-40"
                  {...register("description", { required: "Description is required" })}
                  shadow
                />
                {errors.description && <p className="text-red-600">{errors.description.message}</p>}
              </div>
              <Button type="submit">Cập Nhật Video</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditVideo;
