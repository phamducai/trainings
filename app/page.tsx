// 'use client';

// import { useState } from 'react';
// import axios from 'axios';

// export default function Home() {
//   const [loading, setLoading] = useState(false);

//   const handleExport = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get('/api/enqueue', {
//         responseType: 'blob',
//       });
//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', 'users.csv');
//       document.body.appendChild(link);
//       link.click();
//     } catch (error) {
//       console.error('Error exporting data:', error);
//       alert('An error occurred while exporting the data');
//     }
//     setLoading(false);
//   };

//   return (
//     <div>
//       <h1>Export Data to CSV</h1>
//       <button onClick={handleExport} disabled={loading}>
//         {loading ? 'Processing...' : 'Export Data'}
//       </button>
//     </div>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { CourseDto } from "@/dto/course.dto";

import { CarouselComponent } from "@/component/CarouselComponent";
import { Header } from "@/component/Header";
import { CardComponent } from "@/component/CardComponent";
import { FooterComponents } from "@/component/Footer";
import { LoadingComponent } from "@/component/Loading";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    const checkPasswordChangeStatus = async () => {
      if (status === "authenticated" && session?.user) {
        try {
          const response = await axios.post(`/api/get-user`, { email: session.user.email });
          const user = response.data;
          if (user.isPasswordChanged === false) {
            router.push("/change-password");
          } else {
            fetchData();
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      } else if (status === "unauthenticated") {
        router.push("/login");
      }
    };

    const fetchData = async () => {
      try {
        const res = await axios.get("/api/courses");
        setCourses(res.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    checkPasswordChangeStatus();
  }, [status]);

  return (
    <div className="">
      <Header />
      {loading ? (
        <LoadingComponent />
      ) : (
        <div className="mt-20 container mx-auto mb-20">
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
      {!loading && <FooterComponents />}
    </div>
  );
}
