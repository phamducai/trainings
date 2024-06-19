"use client";

import { SidebarAdmin } from "@/component/SideBarAdmin";
import { CourseDto } from "@/dto/course.dto";
import axios from "axios";
import { Label, TextInput, Textarea, Select } from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/component/LoadingButton";
import { Header } from "@/component/Header";

type FormValues = {
  title: string;
  videoFile: FileList;
  course_id: string;
  description: string;
  display_order: number;
};

const AddVideo: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [message, setMessage] = useState<string | null>(null);
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    const formData = new FormData();
    const videoFile = data.videoFile[0];
    formData.append("title", data.title);
    formData.append("course_id", data.course_id);
    formData.append("description", data.description);
    formData.append("display_order", data.display_order.toString());
    formData.append("file", videoFile);

    try {
      await axios.post("/api/videos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      router.push("/videos");
    } catch (error) {
      console.error("Error uploading video:", error);
      setMessage("Error uploading video.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <Header/>
      <div className="mt-20 mb-20">
        <div className="flex">
          <SidebarAdmin />
          <div className="w-3/4 mx-auto">
            <h1 className="text-2xl font-bold mb-4">Thêm Video</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-md flex-col gap-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="title" value="Thêm Video" />
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
                <Select
                  id="course_id"
                  {...register("course_id", { required: "Course is required" })}
                >
                  <option value="">Chọn Khóa Học</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </Select>
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
                  <Label htmlFor="videoFile" value="Upload Video" />
                </div>
                <input
                  id="videoFile"
                  type="file"
                  {...register("videoFile", { required: "Video file is required" })}
                  accept="video/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {errors.videoFile && <p className="text-red-600">{errors.videoFile.message}</p>}
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
              <LoadingButton isLoading={isLoading} type="submit">
                Upload Video
              </LoadingButton>
              {message && <p>{message}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVideo;
