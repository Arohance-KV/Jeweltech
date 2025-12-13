import React, { useEffect } from "react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = {
    success: "bg-green-100 text-green-800 border-green-300",
    error: "bg-red-100 text-red-800 border-red-300",
    info: "bg-blue-100 text-blue-800 border-blue-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
  }[type] || "bg-green-100 text-green-800 border-green-300";

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠",
  };

  return (
    <div
      className={`fixed top-20 right-6 px-6 py-4 rounded-lg shadow-lg border ${bgColor} 
      animate-slideIn z-50 flex items-center gap-3`}
    >
      <span className="text-xl font-bold">{icons[type]}</span>
      <p className="text-sm font-medium">{message}</p>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(400px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default Toast;
