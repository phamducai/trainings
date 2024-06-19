"use client";

import { Button, Spinner } from "flowbite-react";

type LoadingButtonProps = {
  isLoading: boolean;
  children: React.ReactNode;
  color?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  children,
  color = "blue",
  onClick,
  type = "button",
}) => {
  return (
    <Button color={color} onClick={onClick} disabled={isLoading} type={type}>
      {isLoading ? (
        <>
          <Spinner aria-label="Loading" size="sm" />
          <span className="pl-3">Loading...</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
};
