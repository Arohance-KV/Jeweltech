import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestOTP, verifyOTP } from "../Slices/userSlice";

const OTPModal = ({ isOpen, onClose, onOtpVerified }) => {
  const dispatch = useDispatch();
  const { status, error: reduxError } = useSelector((state) => state.user);

  const [step, setStep] = useState(1);
  const [isdCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  /* ----------------------------------
      STEP 1 → SEND OTP
  -----------------------------------*/
  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }
    setError("");

    // Dispatch Redux thunk to request OTP
    const result = await dispatch(
      requestOTP({ isdCode, phoneNumber: phone })
    );

    if (result.payload) {
      setStep(2);
    } else {
      setError(reduxError || "Failed to send OTP");
    }
  };

  /* ----------------------------------
      STEP 2 → OTP VERIFICATION
  -----------------------------------*/
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.join("").length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setError("");

    // Dispatch Redux thunk to verify OTP
    const result = await dispatch(
      verifyOTP({ isdCode, phoneNumber: phone, otp: otp.join("") })
    );

    if (result.payload) {
      // ↓ï¸ CLOSE OTP MODAL + OPEN USER FORM MODAL
      onClose();
      
      // Save accessToken to localStorage for persistent login
      localStorage.setItem("accessToken", result.payload.accessToken);
      
      onOtpVerified({
        isdCode,
        phone,
        accessToken: result.payload.accessToken,
        userStatus: result.payload.status,
      });
    } else {
      setError(reduxError || "Failed to verify OTP");
    }
  };

  const handleResendOtp = () => {
    setStep(1);
    setOtp(["", "", "", "", "", ""]);
    setError("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-3 sm:px-4 py-4 sm:py-8">
      <div className="bg-white/95 w-full max-w-xs sm:max-w-sm md:max-w-md rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 relative border border-[#f3d4cd] max-h-[90vh] overflow-y-auto">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 sm:right-6 top-4 sm:top-6 text-xl sm:text-2xl text-gray-400 hover:text-gray-600 transition-colors duration-200"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* ==============================
            STEP 1 : PHONE INPUT
        ============================== */}
        {step === 1 && (
          <>
            {/* Header */}
            <div className="mb-6 sm:mb-8 pt-2">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#8a4d55] text-center leading-tight">
                Verify Your Number
              </h2>
              <p className="text-xs sm:text-sm text-[#8a4d55]/60 text-center mt-2">
                We'll send you an OTP to confirm your identity
              </p>
            </div>

            {/* ISD Code + Phone Input */}
            <div className="flex gap-2 sm:gap-3 mb-4">
              <div className="flex items-center px-3 sm:px-4 py-2.5 sm:py-3 bg-[#f5d3cd]/30 border border-[#eac1bb] rounded-lg sm:rounded-xl text-[#8a4d55] text-xs sm:text-sm font-medium">
                +91 🇮🇳
              </div>

              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setPhone(val.slice(0, 10));
                }}
                placeholder="10-digit number"
                className="flex-1 border border-[#eac1bb] px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base bg-white text-[#8a4d55] placeholder-[#8a4d55]/40 focus:ring-2 focus:ring-[#eac1bb] focus:outline-none transition-all"
                maxLength={10}
                inputMode="numeric"
              />
            </div>

            {/* Phone Number Display */}
            {phone && (
              <div className="text-xs sm:text-sm text-[#8a4d55]/70 mb-4 px-3 py-2 bg-[#f5d3cd]/30 rounded-lg">
                We'll send OTP to: <strong>+91 {phone}</strong>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50/80 border border-red-200 text-red-600 text-xs sm:text-sm rounded-lg px-3 sm:px-4 py-2 sm:py-3 mb-4">
                {error}
              </div>
            )}

            {/* Send OTP Button */}
            <button
              onClick={handleSendOtp}
              disabled={status === "loading" || phone.length !== 10}
              className="w-full py-2.5 sm:py-3 bg-linear-to-r from-[#eac1bb] to-[#e0b3a9] text-[#8a4d55] rounded-full text-sm sm:text-lg font-semibold shadow-md hover:shadow-lg hover:from-[#d9a9a0] hover:to-[#cf9a8f] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-2"
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-[#8a4d55]/30 border-t-[#8a4d55] rounded-full animate-spin"></span>
                  Sending...
                </span>
              ) : (
                "Send OTP"
              )}
            </button>
          </>
        )}

        {/* ==============================
            STEP 2 : OTP INPUT
        ============================== */}
        {step === 2 && (
          <>
            {/* Header */}
            <div className="mb-6 sm:mb-8 pt-2">
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#8a4d55] text-center leading-tight">
                Enter OTP
              </h2>
              <p className="text-xs sm:text-sm text-[#8a4d55]/60 text-center mt-2">
                Enter the 6-digit code sent to +91 {phone}
              </p>
            </div>

            {/* OTP Input Fields */}
            <div className="flex justify-center gap-1.5 sm:gap-2 mb-5 sm:mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) =>
                    handleOtpChange(e.target.value.replace(/\D/g, ""), index)
                  }
                  onKeyDown={(e) => handleBackspace(e, index)}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-semibold border-2 border-[#eac1bb] rounded-lg sm:rounded-xl 
                  focus:ring-2 focus:ring-[#eac1bb] focus:border-[#8a4d55] bg-white text-[#8a4d55] shadow-sm transition-all duration-200 focus:outline-none"
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50/80 border border-red-200 text-red-600 text-xs sm:text-sm rounded-lg px-3 sm:px-4 py-2 sm:py-3 mb-4">
                {error}
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={handleVerifyOtp}
              disabled={status === "loading" || otp.join("").length !== 6}
              className="w-full py-2.5 sm:py-3 bg-linear-to-r from-[#eac1bb] to-[#e0b3a9] text-[#8a4d55] rounded-full text-sm sm:text-lg font-semibold shadow-md hover:shadow-lg hover:from-[#d9a9a0] hover:to-[#cf9a8f] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mb-3"
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-[#8a4d55]/30 border-t-[#8a4d55] rounded-full animate-spin"></span>
                  Verifying...
                </span>
              ) : (
                "Verify OTP"
              )}
            </button>

            {/* Resend OTP Link */}
            <button
              onClick={handleResendOtp}
              className="w-full text-xs sm:text-sm text-[#8a4d55]/70 hover:text-[#8a4d55] font-medium transition-colors duration-200 py-2"
            >
              Didn't receive OTP? <span className="underline">Change number</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OTPModal;