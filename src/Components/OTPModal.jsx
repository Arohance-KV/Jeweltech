import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestOTP, verifyOTP } from "../Slices/userSlice";

const OTPModal = ({ isOpen, onClose, onOtpVerified }) => {
  const dispatch = useDispatch();
  const { status, error: reduxError } = useSelector((state) => state.user);

  const [step, setStep] = useState(1);
  const [isdCode, setIsdCode] = useState("+91");
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
      // ⬇️ CLOSE OTP MODAL + OPEN USER FORM MODAL
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white/90 w-full max-w-md rounded-3xl shadow-2xl p-8 relative border border-[#f3d4cd]">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-2xl text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* ------------------------------
            STEP 1 : PHONE INPUT
        ------------------------------ */}
        {step === 1 && (
          <>
            <h2 className="text-3xl font-semibold text-[#8a4d55] mb-6 text-center">
              Verify Your Number
            </h2>

            <div className="flex gap-3">
              <select
                value={isdCode}
                onChange={(e) => setIsdCode(e.target.value)}
                className="w-28 border border-[#eac1bb] rounded-xl px-3 py-3 bg-white text-[#8a4d55]"
              >
                <option>+91 🇮🇳</option>
                <option>+1 🇺🇸</option>
                <option>+44 🇬🇧</option>
                <option>+971 🇦🇪</option>
              </select>

              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setPhone(val.slice(0, 10));
                }}
                placeholder="Enter 10-digit number"
                className="flex-1 border border-[#eac1bb] px-4 py-3 rounded-xl"
                maxLength={10}
              />
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <button
              onClick={handleSendOtp}
              disabled={status === "loading"}
              className="w-full mt-6 py-3 bg-[#eac1bb] text-[#8a4d55] rounded-full text-lg shadow-md hover:bg-[#d9a9a0] disabled:opacity-50"
            >
              {status === "loading" ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* ------------------------------
            STEP 2 : OTP INPUT
        ------------------------------ */}
        {step === 2 && (
          <>
            <h2 className="text-3xl font-semibold text-[#8a4d55] mb-6 text-center">
              Enter OTP
            </h2>

            <div className="flex justify-between mb-4 gap-2">
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
                  className="w-12 h-14 text-center text-2xl border border-[#eac1bb] rounded-xl 
                  focus:ring-2 focus:ring-[#eac1bb] bg-white shadow-sm"
                />
              ))}
            </div>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <button
              onClick={handleVerifyOtp}
              disabled={status === "loading"}
              className="w-full py-3 bg-[#eac1bb] text-[#8a4d55] rounded-full text-lg shadow-md hover:bg-[#d9a9a0] disabled:opacity-50"
            >
              {status === "loading" ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OTPModal;
