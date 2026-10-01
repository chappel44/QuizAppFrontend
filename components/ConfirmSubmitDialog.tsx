"use client";

import { AnimatePresence, motion } from "framer-motion";

interface ConfirmSubmitDialogProps {
  open: boolean;
  submitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmSubmitDialog({ open, submitting, onCancel, onConfirm }: ConfirmSubmitDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !submitting && onCancel()}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-800">Submit your test?</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to submit? You won't be able to change your answers afterward.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onCancel}
                disabled={submitting}
                className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={submitting}
                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Yes, submit"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}