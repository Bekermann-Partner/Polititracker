import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  /** time in milliseconds until onClose is called (use -1 if toast shouldn't close automatically)*/
  timeout?: number;
  onClose: () => void;
}

export default function Toast({
  message,
  type,
  onClose,
  timeout = 4000,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (timeout !== -1) {
      // close Toast after time seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose(); // call onClose-function, to remove the Toast
      }, timeout);

      return () => clearTimeout(timer); // clear Timer, when component is unmounted
    }
  }, [onClose, timeout]);

  if (!isVisible) return null;

  return (
    <button
      onClick={onClose}
      aria-label="Close toast"
      className={`fixed top-12 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-lg text-white ${
        type === 'success'
          ? 'bg-green-600'
          : type === 'error'
            ? 'bg-red-600'
            : 'bg-blue-600'
      }`}
    >
      {message}
    </button>
  );
}
