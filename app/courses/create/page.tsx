"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button, Label, Textarea, TextInput } from "flowbite-react";
import { SidebarAdmin } from "@/component/SideBarAdmin";
import { Header } from "@/component/Header";

type FormValues = {
  title: string;
  description: string;
  imgSrc: string;
  createdBy: number;
  displayOrder: number;
};

const NewCourse: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (base64Image) {
      data.imgSrc = base64Image;
    }

    try {
      await axios.post("/api/courses", data);
      router.push("/courses");
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setBase64Image(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="">
    <Header />
    <div className="mt-20 mb-20">
        <div className="flex">
          <SidebarAdmin />
          <div className="w-3/4 mx-auto">
            <h1 className="text-2xl font-bold mb-4">Tạo Khóa Học</h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex max-w-md flex-col gap-4"
            >
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="nameCourse" value="Tên Khóa Học" />
                </div>
                <TextInput
                  id="nameCourse"
                  type="text"
                  placeholder="Tên Khóa Học"
                  {...register("title", { required: "Title is required" })}
                  shadow
                />
                {errors.title && (
                  <p className="text-red-600">{errors.title.message}</p>
                )}
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="displayOrder" value="Thứ tự hiển thị" />
                </div>
                <TextInput
                  id="displayOrder"
                  type="number"
                  {...register("displayOrder")}
                  placeholder="1"
                  shadow
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="description" value="Mô tả" />
                </div>
                <Textarea
                  id="description"
                  {...register("description")}
                  shadow
                  className="h-40"
                  placeholder="Mô tả khóa học"
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="uploadFile1" value="Up Load" />
                </div>
                <label
                  htmlFor="uploadFile1"
                  className="bg-white text-gray-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif]"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-52"
                    />
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-11 mb-2 fill-gray-500"
                        viewBox="0 0 32 32"
                      >
                        <path
                          d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                          data-original="#000000"
                        />
                        <path
                          d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                          data-original="#000000"
                        />
                      </svg>
                      Upload file
                      <p className="text-xs font-medium text-gray-400 mt-2">
                        PNG, JPG and SVG are Allowed.
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    id="uploadFile1"
                    className="hidden"
                    onChange={handleImageChange}
                    required
                    accept=".png, .jpg, .svg"
                  />
                </label>
              </div>

              <div className="flex justify-center">
                <Button type="submit">Tạo Khóa Học</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCourse;
