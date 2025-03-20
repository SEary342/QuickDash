import { mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import { AnimatePresence, motion } from "motion/react";

interface DialogProps {
  title: string;
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: (confirm: boolean) => void;
  disableConfirm?: boolean;
  confirmClass?: string;
  actionButton?: {text: string; color: string; action: ()=>void}
}

export const Dialog = ({
  title,
  children,
  isOpen = false,
  onClose,
  disableConfirm = false,
  confirmClass = "",
  actionButton,
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
              <div className="px-6 pb-4 text-black text-start">{children}</div>
              <div className="bg-gray-50 px-6 p-4 flex justify-between space-x-3 rounded-b-lg">
                <button
                  onClick={() => onClose(false)}
                  className="bg-white px-4 py-2 rounded-md cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300"
                >
                  Cancel
                </button>
                {actionButton ? <button className={`px-4 py-2 rounded-md cursor-pointer text-sm font-medium ${actionButton.color}`} onClick={actionButton.action}>{actionButton.text}</button> : ""}
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium 
                    ${
                      disableConfirm
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                    } ${confirmClass}`}
                  onClick={() => onClose(true)}
                  disabled={disableConfirm}
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
