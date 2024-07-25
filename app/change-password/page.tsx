"use client";

import { useState } from "react";
import { Header } from "@/component/Header";
import { getSession, useSession} from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { SuccessModal } from "@/component/SuccessModal";

interface IFormInput {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Courses: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm<IFormInput>();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { data: session } = useSession();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    clearErrors();
    if (data.newPassword !== data.confirmPassword) {
      setError("confirmPassword", { type: "manual", message: "Mật khẩu xác nhận không khớp." });
      return;
    }

    const response = await fetch("/api/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: session?.user?.email,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }),
    });

    if (response.ok) {
      setShowSuccessModal(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else {
        const result = await response.json();
        setError("oldPassword", { type: "manual", message: result.message });
    }
  };

  return (
    <div>
      <Header activeLink={2} />
      <SuccessModal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Mật khẩu đã được thay đổi thành công!"
      />
      <section className="bg-gray-50 dark:bg-gray-900 mt-10">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
            <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Thay Đổi Mật Khẩu
            </h2>
            <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="old-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Mật Khẩu Cũ
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    id="old-password"
                    {...register("oldPassword", { required: "Vui lòng nhập mật khẩu cũ" })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Mật Khẩu Cũ"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    onClick={toggleOldPasswordVisibility}
                  >
                    {showOldPassword ? (
                      <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 2C5.8 2 2.2 5 1 9.5 2.2 14 5.8 17 10 17s7.8-3 9-7.5C17.8 5 14.2 2 10 2zm0 13c-3.2 0-6-2.2-7-5.5C4 6.5 6.8 4 10 4s6 2.2 7 5.5c-1 3.3-3.8 5.5-7 5.5zm0-9a3 3 0 100 6 3 3 0 000-6zm0 4a1 1 0 110-2 1 1 0 010 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 2C5.8 2 2.2 5 1 9.5 2.2 14 5.8 17 10 17s7.8-3 9-7.5C17.8 5 14.2 2 10 2zm0 13c-3.2 0-6-2.2-7-5.5C4 6.5 6.8 4 10 4s6 2.2 7 5.5c-1 3.3-3.8 5.5-7 5.5zm0-9a3 3 0 100 6 3 3 0 000-6zm0 4a1 1 0 110-2 1 1 0 010 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.oldPassword && <p className="text-red-500 text-sm mt-2">{errors.oldPassword.message}</p>}
              </div>
              <div>
                <label
                  htmlFor="new-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Mật Khẩu Mới
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="new-password"
                    {...register("newPassword", { required: "Vui lòng nhập mật khẩu mới" })}
                    placeholder="Mật Khẩu Mới"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    onClick={toggleNewPasswordVisibility}
                  >
                    {showNewPassword ? (
                      <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 2C5.8 2 2.2 5 1 9.5 2.2 14 5.8 17 10 17s7.8-3 9-7.5C17.8 5 14.2 2 10 2zm0 13c-3.2 0-6-2.2-7-5.5C4 6.5 6.8 4 10 4s6 2.2 7 5.5c-1 3.3-3.8 5.5-7 5.5zm0-9a3 3 0 100 6 3 3 0 000-6zm0 4a1 1 0 110-2 1 1 0 010 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 2C5.8 2 2.2 5 1 9.5 2.2 14 5.8 17 10 17s7.8-3 9-7.5C17.8 5 14.2 2 10 2zm0 13c-3.2 0-6-2.2-7-5.5C4 6.5 6.8 4 10 4s6 2.2 7 5.5c-1 3.3-3.8 5.5-7 5.5zm0-9a3 3 0 100 6 3 3 0 000-6zm0 4a1 1 0 110-2 1 1 0 010 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.newPassword && <p className="text-red-500 text-sm mt-2">{errors.newPassword.message}</p>}
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Xác Nhận Mật Khẩu
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    {...register("confirmPassword", { required: "Vui lòng xác nhận mật khẩu mới" })}
                    placeholder="Xác Nhận Mật Khẩu"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
                      <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 2C5.8 2 2.2 5 1 9.5 2.2 14 5.8 17 10 17s7.8-3 9-7.5C17.8 5 14.2 2 10 2zm0 13c-3.2 0-6-2.2-7-5.5C4 6.5 6.8 4 10 4s6 2.2 7 5.5c-1 3.3-3.8 5.5-7 5.5zm0-9a3 3 0 100 6 3 3 0 000-6zm0 4a1 1 0 110-2 1 1 0 010 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 2C5.8 2 2.2 5 1 9.5 2.2 14 5.8 17 10 17s7.8-3 9-7.5C17.8 5 14.2 2 10 2zm0 13c-3.2 0-6-2.2-7-5.5C4 6.5 6.8 4 10 4s6 2.2 7 5.5c-1 3.3-3.8 5.5-7 5.5zm0-9a3 3 0 100 6 3 3 0 000-6zm0 4a1 1 0 110-2 1 1 0 010 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-2">{errors.confirmPassword.message}</p>}
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Đổi Mật Khẩu
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;
