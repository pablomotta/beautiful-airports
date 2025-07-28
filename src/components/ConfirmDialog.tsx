"use client";

import { useEffect } from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDangerous = false,
}: ConfirmDialogProps) {
  // Prevent background scrolling when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      onClick={onCancel}
    >
      <div
        className="mx-auto w-full max-w-md transform rounded-lg bg-white shadow-xl transition-all"
        style={{
          maxHeight: "90vh",
          animation: isOpen ? "fadeInScale 0.2s ease-out" : undefined,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="mb-3 text-xl font-semibold text-gray-900">{title}</h2>
          <p className="mb-6 leading-relaxed text-gray-600">{message}</p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={onCancel}
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:w-auto"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`w-full rounded-md px-4 py-2 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto ${
                isDangerous
                  ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
