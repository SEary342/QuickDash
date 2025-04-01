import { Dialog } from "../Dialog/Dialog";

interface ConfirmDialogProps {
  message: string;
  isOpen: boolean;
  onConfirm: (confirmed: boolean) => void;
}

export const ConfirmDialog = ({ message, isOpen, onConfirm }: ConfirmDialogProps) => {
  return (
    <Dialog
      title="Confirmation"
      isOpen={isOpen}
      onClose={onConfirm}
      confirmClass="bg-red-600 hover:bg-red-700"
    >
      <p className="text-gray-700">{message}</p>
    </Dialog>
  );
};
