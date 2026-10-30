import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Delete', tone = 'danger' }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      icon={
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone === 'danger' ? 'bg-red-50 text-red-600' : 'bg-accent-tint text-accent'}`}>
          <AlertTriangle className="h-5 w-5" />
        </span>
      }
      footer={
        <>
          <button type="button" className="btn btn-outline" onClick={onClose} data-autofocus>
            Cancel
          </button>
          <button type="button" className={`btn ${tone === 'danger' ? 'btn-danger-solid' : 'btn-primary'}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="text-sm leading-relaxed text-muted">{message}</div>
    </Modal>
  );
}
