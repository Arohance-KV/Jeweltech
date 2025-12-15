import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../Slices/userSlice";

const UserFormModal = ({
  isOpen,
  onClose,
  phone,
  isdCode,
  accessToken,
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const {
    status,
    error: reduxError,
    userStatus: updatedStatus,
  } = useSelector((state) => state.user);

  if (!isOpen) return null;

  const handleUserSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const profileData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      buisnessName: formData.get("buisnessName"),
      gstNumber: formData.get("gstNumber"),
      email: formData.get("email"),
      city: formData.get("city"),
      state: formData.get("state"),
      phoneNumber: phone,
      isdCode: isdCode,
    };

    // Dispatch Redux thunk to update profile
    const result = await dispatch(updateProfile(profileData));

    if (result.payload) {
      // Save user data and access token to localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...profileData,
          phone: phone,
        })
      );
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      if (onSuccess)
        onSuccess({
          ...profileData,
          phone: phone,
        });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-3 sm:px-4 py-4 sm:py-8 overflow-y-auto">
      <div className="bg-white/95 w-full max-w-xs sm:max-w-sm md:max-w-md rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 relative border border-[#f3d4cd] my-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#8a4d55] text-center leading-tight">
            Complete Your Profile
          </h2>
          <p className="text-xs sm:text-sm text-[#8a4d55]/60 text-center mt-2">
            Add your details to get started
          </p>
        </div>

        {/* Error Message */}
        {reduxError && (
          <div className="bg-red-50/80 border border-red-200 text-red-600 text-xs sm:text-sm rounded-lg px-3 sm:px-4 py-2 sm:py-3 mb-4">
            {reduxError}
          </div>
        )}

        {/* Approval Status Alert */}
        {updatedStatus === "pending_details" && (
          <div className="bg-yellow-50/80 border border-yellow-200 text-yellow-700 text-xs sm:text-sm rounded-lg px-3 sm:px-4 py-3 sm:py-4 mb-5 sm:mb-6 flex gap-2">
            <span className="text-base sm:text-lg flex shrink-0">⏳</span>
            <span>Your profile is pending admin approval. We'll notify you once verified!</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleUserSubmit} className="space-y-3 sm:space-y-4">
          
          {/* Name Row - Two columns */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <input
              name="firstName"
              placeholder="First Name"
              className="w-full border border-[#eac1bb] rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm bg-white text-[#8a4d55] placeholder-[#8a4d55]/40 focus:ring-2 focus:ring-[#eac1bb] focus:outline-none transition-all"
              required
            />
            <input
              name="lastName"
              placeholder="Last Name"
              className="w-full border border-[#eac1bb] rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm bg-white text-[#8a4d55] placeholder-[#8a4d55]/40 focus:ring-2 focus:ring-[#eac1bb] focus:outline-none transition-all"
              required
            />
          </div>

          {/* Business Name */}
          <input
            name="buisnessName"
            placeholder="Business Name"
            className="w-full border border-[#eac1bb] rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm bg-white text-[#8a4d55] placeholder-[#8a4d55]/40 focus:ring-2 focus:ring-[#eac1bb] focus:outline-none transition-all"
            required
          />

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            className="w-full border border-[#eac1bb] rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm bg-white text-[#8a4d55] placeholder-[#8a4d55]/40 focus:ring-2 focus:ring-[#eac1bb] focus:outline-none transition-all"
            required
          />

          {/* GST Number */}
          <input
            name="gstNumber"
            placeholder="GST Number (Optional)"
            pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
            title="Enter valid GST Number (e.g. 22AAAAA0000A1Z5)"
            className="w-full border border-[#eac1bb] rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm bg-white text-[#8a4d55] placeholder-[#8a4d55]/40 focus:ring-2 focus:ring-[#eac1bb] focus:outline-none transition-all"
          />

          {/* City + State Row - Two columns */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <input
              name="city"
              placeholder="City"
              className="w-full border border-[#eac1bb] rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm bg-white text-[#8a4d55] placeholder-[#8a4d55]/40 focus:ring-2 focus:ring-[#eac1bb] focus:outline-none transition-all"
              required
            />
            <input
              name="state"
              placeholder="State"
              className="w-full border border-[#eac1bb] rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm bg-white text-[#8a4d55] placeholder-[#8a4d55]/40 focus:ring-2 focus:ring-[#eac1bb] focus:outline-none transition-all"
              required
            />
          </div>

          {/* Verified Phone Display (read-only) */}
          <div className="bg-[#f7e7e2]/60 border border-[#eac1bb] text-[#8a4d55] text-xs sm:text-sm rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2">
            <span className="text-base sm:text-lg flex shrink-0">✓</span>
            <span>
              Verified Phone: <strong>+91 {phone}</strong>
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full mt-5 sm:mt-6 py-2.5 sm:py-3 bg-linear-to-r from-[#eac1bb] to-[#e0b3a9] text-[#8a4d55] rounded-full text-sm sm:text-base font-semibold shadow-md hover:shadow-lg hover:from-[#d9a9a0] hover:to-[#cf9a8f] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {status === "loading" ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-[#8a4d55]/30 border-t-[#8a4d55] rounded-full animate-spin"></span>
                Saving...
              </span>
            ) : (
              "Save & Continue"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;