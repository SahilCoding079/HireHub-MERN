import { FiAlertTriangle, FiX } from "react-icons/fi";

const ConfirmModal = ({
  isOpen,
  title = "Confirm deletion",
  message,
  confirmLabel = "Delete",
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-[#19221d]/40 px-5 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isLoading) onCancel();
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[#dfe8df] bg-white p-6 shadow-[0_20px_60px_rgba(25,34,29,0.18)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0d9] text-[#a9651c]">
            <FiAlertTriangle size={21} />
          </span>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#819087] transition hover:bg-[#f1f5ed] hover:text-[#19221d] disabled:cursor-wait disabled:opacity-50"
            aria-label="Close confirmation dialog"
          >
            <FiX size={19} />
          </button>
        </div>
        <h2 id="confirm-modal-title" className="mt-5 font-serif text-3xl text-[#19221d]">
          {title}
        </h2>
        <p id="confirm-modal-message" className="mt-2 text-sm leading-6 text-[#69766e]">
          {message}
        </p>
        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-xl px-4 py-3 text-sm font-bold text-[#69766e] transition hover:bg-[#f1f5ed] disabled:cursor-wait disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-xl bg-[#c34e42] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#a83f35] disabled:cursor-wait disabled:opacity-60"
          >
            {isLoading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;