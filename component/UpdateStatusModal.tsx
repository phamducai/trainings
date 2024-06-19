"use client";

import { Button, Modal } from "flowbite-react";
import { HiOutlineCheckCircle, HiOutlineExclamationCircle } from "react-icons/hi";

type UpdateStatusModalProps = {
  show: boolean;
  onClose: () => void;
  isSuccess: boolean;
  message: string;
};

export const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  show,
  onClose,
  isSuccess,
  message,
}) => {
  return (
    <Modal show={show} size="md" onClose={onClose} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          {isSuccess ? (
            <HiOutlineCheckCircle className="mx-auto mb-4 h-14 w-14 text-green-400 dark:text-green-200" />
          ) : (
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-400 dark:text-red-200" />
          )}
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            {message}
          </h3>
          <div className="flex justify-center">
            <Button onClick={onClose} color={isSuccess ? "green" : "red"}>
              {isSuccess ? "OK" : "Close"}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
