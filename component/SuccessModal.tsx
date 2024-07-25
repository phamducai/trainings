"use client";

import { Button, Modal } from "flowbite-react";
import { HiOutlineCheckCircle } from "react-icons/hi";

type SuccessModalProps = {
  show: boolean;
  onClose: () => void;
  message: string;
};

export const SuccessModal: React.FC<SuccessModalProps> = ({
  show,
  onClose,
  message,
}) => {
  return (
    <Modal show={show} size="md" onClose={onClose} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineCheckCircle className="mx-auto mb-4 h-14 w-14 text-green-400 dark:text-green-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            {message}
          </h3>
          <div className="flex justify-center">
            <Button onClick={onClose} color="green">
              OK
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
