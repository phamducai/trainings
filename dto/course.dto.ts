// src/dto/course.dto.ts

export interface CreateCourseDto {
    title: string;
    description: string;
    imgSrc?: string;
    createdBy?: number;
    totalVideos?: number;
  }
  
  export interface UpdateCourseDto {
    title?: string;
    description?: string;
    imgSrc?: string;
    createdBy?: number;
    totalVideos?: number;
  }
  export interface CourseDto {
    id: number;
    title: string;
    description: string | null;
    imgSrc: string | null;
    created_at: Date | null;
    updated_at: Date | null;
    total_videos: number | null;
    display_order: number | null;
  }
  export interface VideoDto {
    title: string;
    url: string;
    description: string;
  }
  
  export interface CourseWithVideosDto {
    title: string;
    Videos: VideoDto[];
  }
  export interface ListVideoDto{
    id: number;
    title: string;
    url: string;
    course_id: number;
    display_order: number;
    description: string;
    created_at: Date;
    updated_at: Date;
  }