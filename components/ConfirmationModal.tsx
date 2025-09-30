import React from 'react';
import Modal from './Modal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmButtonText = 'Conferma' }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="space-y-6">
        <p className="text-lg text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{message}</p>
        <div className="flex justify-end pt-4 space-x-2 border-t border-slate-200 dark:border-slate-700">
          <button type="button" onClick={onClose} className="px-4 py-2 text-base font-medium text-slate-700 bg-white rounded-md border border-slate-300 hover:bg-slate-50 dark:bg-slate-600 dark:text-slate-200 dark:border-slate-500 dark:hover:bg-slate-500">
            Annulla
          </button>
          <button type="button" onClick={onConfirm} className="px-4 py-2 text-base font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
            {confirmButtonText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
