"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { CourseDto } from "@/dto/course.dto";
import Head from 'next/head';
import { CarouselComponent } from "@/component/CarouselComponent";
import { Header } from "@/component/Header";
import { CardComponent } from "@/component/CardComponent";
import { FooterComponents } from "@/component/Footer";
import { LoadingComponent } from "@/component/Loading";
// import { redirect } from 'next/navigation'

export default function Home() {
  // const accessDenied = true
  // if (accessDenied) {
  //   redirect('/login')
  // }
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("useEffect");
    async function fetchData() {
      try {
        const res = await axios.get("/api/courses");
        setCourses(res.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="">
       <Head>
      <title>Elearning Famima VN - Your Hub for Online Learning</title>
      <meta name="description" content="Welcome to Elearning Famima VN, your hub for online learning resources." />
      <meta name="keywords" content="e-learning, online courses, education, Famima" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content="Elearning Famima VN" />
      <meta property="og:description" content="Welcome to Elearning Famima VN, your hub for online learning resources." />
      <meta property="og:url" content="https://elearningfamimavn.com" />
      <meta property="og:type" content="website" />
      {/* <meta property="og:image" content="https://elearningfamimavn.com/path/to/image.jpg" /> */}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Elearning Famima VN" />
      <meta name="twitter:description" content="Welcome to Elearning Famima VN, your hub for online learning resources." />
      {/* <meta name="twitter:image" content="https://elearningfamimavn.com/path/to/image.jpg" /> */}
    </Head>
      <Header />
      {loading ? (
        <LoadingComponent />
      ) : (
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
      )}
      <FooterComponents />
    </div>
  );
}
