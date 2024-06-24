"use client";

import React, { useEffect, useState, useRef } from "react";
import { Sidebar, Accordion } from "flowbite-react";
import clsx from "clsx";
import axios from "axios";
import { CourseWithVideosDto, VideoDto } from "@/dto/course.dto";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

const CustomSidebar: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoDto | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [course, setCourse] = useState<CourseWithVideosDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [fullscreenClickCount, setFullscreenClickCount] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const { id } = useParams();

  const handleItemClick = (video: VideoDto | null, index: number | null) => {
    setSelectedVideo(video);
    setActiveIndex(index);
    setZoomLevel(1); // Reset zoom level when a new video is selected
  };

  useEffect(() => {
    async function fetchData() {
      try {
        let courseId = id;
        setLoading(true);
        const res = await axios.get(`/api/videos?courseId=${courseId}`);
        setCourse(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (watermarkRef.current && videoRef.current) {
        const isFullscreen = document.fullscreenElement === videoRef.current;

        if (isFullscreen) {
          watermarkRef.current.classList.add('fullscreen-watermark');
          watermarkRef.current.classList.remove('normal-watermark');
        } else {
          watermarkRef.current.classList.remove('fullscreen-watermark');
          watermarkRef.current.classList.add('normal-watermark');
          setFullscreenClickCount((prevCount) => prevCount + 1);
        }
        
        console.log("isFullscreen", isFullscreen);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="sm:flex h-screen overflow-y-auto sticky top-16">
      <div className="flex-1 sm:p-4 sm:h-full overflow-y-auto mb-10 sm:mb-0">
        {selectedVideo && (
          <div className="mt-10">
            <div className="text-center text-2xl font-bold text-gray-700 mb-4">{selectedVideo.title}</div>
            <div className="flex justify-center relative">
              <video
                key={selectedVideo.url}
                ref={videoRef}
                controls
                width={`${80 * zoomLevel}%`}
                height="auto"
                controlsList="nodownload"
                style={{ transform: `scale(${zoomLevel})` }}
                className="no-fullscreen-button"
                disablePictureInPicture
              >
                <source src={selectedVideo.url} type="video/mp4" />
              </video>
              <div ref={watermarkRef} className="watermark normal-watermark">
                {session?.user?.use_id || ""} -  {session?.user?.full_name || ""} 
              </div>
            </div>
          </div>
        )}
        {!selectedVideo && (
          <div className="flex justify-center mt-16 ml-6 mr-6">
            {course && (
              <Accordion collapseAll className="w-full">
                {course.Videos?.map((video) => (
                  <Accordion.Panel key={video.title}>
                    <Accordion.Title>{video.title}</Accordion.Title>
                    <Accordion.Content>{video.description}</Accordion.Content>
                  </Accordion.Panel>
                ))}
              </Accordion>
            )}
          </div>
        )}
      </div>
      <Sidebar
        aria-label="Sidebar with multi-level dropdown example"
        className="w-slide"
      >
        <Sidebar.Items>
          {course && (
            <Sidebar.ItemGroup>
              <Sidebar.Collapse label={course.title} className="font-bold" open>
                <Sidebar.Item
                  onClick={() => handleItemClick(null, null)}
                  className={clsx({
                    "bg-gray-200 font-bold": activeIndex === null,
                  })}
                >
                  Tổng quan
                </Sidebar.Item>
                {course.Videos?.map((video, videoIndex) => (
                  <Sidebar.Item
                    key={videoIndex}
                    onClick={() => handleItemClick(video, videoIndex)}
                    className={clsx({
                      "bg-gray-200 font-bold": activeIndex === videoIndex,
                    })}
                  >
                    {video.title}
                  </Sidebar.Item>
                ))}
              </Sidebar.Collapse>
            </Sidebar.ItemGroup>
          )}
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
};

export default CustomSidebar;
