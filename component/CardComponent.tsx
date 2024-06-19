"use client";

import { CourseDto } from "@/dto/course.dto";
import { Button, Card } from "flowbite-react";
import { useRouter } from "next/navigation";

interface CardComponentProps {
  course: CourseDto;
}

export function CardComponent({ course }: CardComponentProps) {
  const router = useRouter(); 
  const handleButtonClick = () => {
    router.push(`/course/${course.id}`); 
  };
  return (
    <Card className="max-w-sm">
      <img src={course.imgSrc?course.imgSrc:''} className="mr-3 w-full rounded" alt={course.title} />
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {course.title}
      </h5>
      <p>{course.description}</p>
      <Button onClick={handleButtonClick}>
        Học ngay
      </Button>
    </Card>
  );
}
