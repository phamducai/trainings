"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { CourseDto } from "@/dto/course.dto";

import { CarouselComponent } from "@/component/CarouselComponent";
import { Header } from "@/component/Header";
import { CardComponent } from "@/component/CardComponent";
import { FooterComponents } from "@/component/Footer";


export default function Home() {
  const [courses, setCourses] = useState<CourseDto[]>([]);
  
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

  return (
    <div className="">
    <Header />
    <div className="mt-20 container mx-auto mb-80">
      <div className="h-72 sm:h-96">
        <CarouselComponent />
      </div>
      <div className="mt-5">
        <h1 className="font-bold text-xl md:text-2xl lg:text-3xl">
          Khóa Học Training Famima
        </h1>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CardComponent key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
    <FooterComponents />
  </div>
  );
}
