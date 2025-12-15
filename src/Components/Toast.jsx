import React, { useEffect, useState } from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle, FiX } from "react-icons/fi";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const config = {
    success: {
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-900",
      borderColor: "border-emerald-200",
      accentColor: "bg-emerald-100",
      icon: FiCheckCircle,
      iconColor: "text-emerald-600",
    },
    error: {
      bgColor: "bg-red-50",
      textColor: "text-red-900",
      borderColor: "border-red-200",
      accentColor: "bg-red-100",
      icon: FiAlertCircle,
      iconColor: "text-red-600",
    },
    info: {
      bgColor: "bg-blue-50",
      textColor: "text-blue-900",
      borderColor: "border-blue-200",
      accentColor: "bg-blue-100",
      icon: FiInfo,
      iconColor: "text-blue-600",
    },
    warning: {
      bgColor: "bg-amber-50",
      textColor: "text-amber-900",
      borderColor: "border-amber-200",
      accentColor: "bg-amber-100",
      icon: FiAlertTriangle,
      iconColor: "text-amber-600",
    },
  };

  const currentConfig = config[type] || config.success;
  const IconComponent = currentConfig.icon;

  return (
    <>
      <div
        className={`fixed top-4 sm:top-6 right-4 sm:right-6 px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-lg border ${currentConfig.bgColor} ${currentConfig.borderColor} ${currentConfig.textColor} 
        z-50 flex items-start sm:items-center gap-3 sm:gap-4 max-w-sm w-full backdrop-blur-sm transition-all duration-300 ${
          isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
        }`}
        style={{
          animation: isExiting ? "none" : "slideIn 0.3s ease forwards",
        }}
      >
        {/* Icon Container */}
        <div className={`flex shrink-0 ${currentConfig.accentColor} rounded-full p-2 sm:p-2.5`}>
          <IconComponent className={`text-lg sm:text-xl ${currentConfig.iconColor}`} />
        </div>

        {/* Message */}
        <p className="text-xs sm:text-sm font-medium flex-1 leading-snug">{message}</p>

        {/* Close Button */}
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(onClose, 300);
          }}
          className={`flex shrink-0 ${currentConfig.accentColor} ${currentConfig.iconColor} rounded-full p-1 sm:p-1.5 hover:opacity-70 transition-opacity duration-200`}
          aria-label="Close notification"
        >
          <FiX className="text-base sm:text-lg" />
        </button>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }
      `}</style>
    </>
  );
};

export default Toast;