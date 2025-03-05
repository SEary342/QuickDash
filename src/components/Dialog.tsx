import { mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import { AnimatePresence, motion } from "motion/react";

interface DialogProps {
  title: string;
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: (confirm: boolean) => void;
}

export const Dialog = ({
  title,
  children,
  isOpen = false,
  onClose,
}: DialogProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full transform">
              <div className="flex justify-between px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                <button
                  onClick={() => onClose(false)}
                  className="text-gray-400 hover:text-gray-500 cursor-pointer"
                >
                  <Icon path={mdiClose} size={1} />
                </button>
              </div>
              <div className="px-6 py-4 text-black text-start">{children}</div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
                <button
                  onClick={() => onClose(false)}
                  className="bg-white px-4 py-2 rounded-md cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 px-4 py-2 rounded-md cursor-pointer text-sm font-medium text-white hover:bg-blue-700"
                  onClick={() => onClose(true)}
                >
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
