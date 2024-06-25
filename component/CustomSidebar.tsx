"use client";

import React, { useEffect, useState, useRef } from "react";
import { Sidebar, Accordion } from "flowbite-react";
import clsx from "clsx";
import axios from "axios";
import { CourseWithVideosDto, VideoDto } from "@/dto/course.dto";
import { useParams } from "next/navigation";
import VideoJS from "./VideoJS";

const CustomSidebar: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoDto | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [course, setCourse] = useState<CourseWithVideosDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();

  const handleItemClick = (video: VideoDto | null, index: number | null) => {
    setSelectedVideo(video);
    setActiveIndex(index);
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
  const handlePlayerReady = (player: any) => {
    console.log('Player is ready', player);
  };

  return (
    <div className="sm:flex h-screen overflow-y-auto sticky top-16">
      <div className="flex-1 sm:p-4 sm:h-full overflow-y-auto mb-10 sm:mb-0">
        {selectedVideo && (
          <div className="mt-10">
            <div className="text-center text-2xl font-bold text-gray-700 mb-4">{selectedVideo.title}</div>
            <div className="flex justify-center relative">
            <VideoJS
                options={{
                  autoplay: true,
                  controls: true,
                  responsive: true,
                  fluid: true,
                  sources: [{ src: selectedVideo.url, type: 'video/mp4' }],
                }}
                onReady={handlePlayerReady}
              />
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
