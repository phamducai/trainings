"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "flowbite-react";
import { SidebarAdmin } from "@/component/SideBarAdmin";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { ListVideoDto } from "@/dto/course.dto";
import { ConfirmModal } from "@/component/ConfirmModal";
import { Header } from "@/component/Header";
import { useSession } from "next-auth/react";

export default function Courses() {
  const [videos, setVideos] = useState<ListVideoDto[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<number | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session || session.user.role !== "admin") {
      router.push("/");
      return;
    }
    async function fetchData() {
      try {
        const res = await axios.get("/api/videos");
        setVideos(res.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    }
    fetchData();
  }, []);

  const handleEdit = (id: number) => {
    router.push(`/videos/${id}`);
  };

  const handleDelete =  async() => {
    if (videoToDelete !== null) {
      try {
        axios.delete(`/api/videos/${videoToDelete}`);
        setVideos(videos.filter((video) => video.id !== videoToDelete));
        setShowConfirmModal(false);
      } catch (error) {
        console.error("Error deleting video:", error);
      }
    }
  };

  const confirmDelete = (id: number) => {
    setVideoToDelete(id);
    setShowConfirmModal(true);
  };

  return (
    <div className="h-screen overflow-y-hidden">
      <Header />
      <div className="pt-20">
        <div className="flex h-screen overflow-y-auto sticky top-16">
          <SidebarAdmin />
          <div className="overflow-x-auto table-w-80 mx-auto">
            <Table>
              <Table.Head>
                <Table.HeadCell>Tên Video</Table.HeadCell>
                <Table.HeadCell>Mô tả</Table.HeadCell>
                <Table.HeadCell>Thứ tự hiện thị</Table.HeadCell>
                <Table.HeadCell>Ngày Cập Nhật</Table.HeadCell>
                <Table.HeadCell>
                  <span className="sr-only">Sửa</span>
                  <span className="sr-only text-red-500">Xóa</span>
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {videos?.map((video) => (
                  <Table.Row
                    key={video.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {video.title}
                    </Table.Cell>
                    <Table.Cell>{video.description}</Table.Cell>
                    <Table.Cell>{video.display_order}</Table.Cell>
                    <Table.Cell>
                      {video.updated_at
                        ? format(new Date(video.updated_at), "dd/MM/yyyy")
                        : ""}
                    </Table.Cell>
                    <Table.Cell>
                      <a
                        onClick={() => handleEdit(video.id)}
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer mr-5"
                      >
                        Sửa
                      </a>
                      <a
                        onClick={() => confirmDelete(video.id)}
                        className="font-medium text-red-600 hover:underline dark:text-red-500 cursor-pointer"
                      >
                        Xóa
                      </a>
                    </Table.Cell>
                  </Table.Row>
                ))}
                {videos.length === 0 && (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell colSpan={5} className="text-center">
                      Không có dữ liệu
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
      <ConfirmModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleDelete}
        message="Bạn có chắc chắn muốn xóa video này không?"      />
    </div>
  );
}
