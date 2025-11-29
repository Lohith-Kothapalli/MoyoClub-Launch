"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      toastOptions={{
        style: {
          background: "white",
          color: "#000000",
          border: "1px solid var(--border)",
        },
        className: "toast-black-text",
      }}
      {...props}
    />
  );
};

export { Toaster };
