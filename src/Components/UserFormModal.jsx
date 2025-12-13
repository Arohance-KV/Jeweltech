import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../Slices/userSlice";

const UserFormModal = ({ isOpen, onClose, phone, isdCode, accessToken, userStatus, onSuccess }) => {
  const dispatch = useDispatch();
  const { status, error: reduxError, userStatus: updatedStatus } = useSelector((state) => state.user);
  if (!isOpen) return null;

  const handleUserSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const profileData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      buisnessName: formData.get("buisnessName"),
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
      localStorage.setItem("user", JSON.stringify({
        ...profileData,
        phone: phone,
      }));
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      if (onSuccess) onSuccess({
        ...profileData,
        phone: phone,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white/90 w-full max-w-md rounded-3xl shadow-2xl p-8 relative border border-[#f3d4cd]">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-2xl text-gray-500 hover:text-gray-700 transition"
        >
          ✕
        </button>

        <h2 className="text-3xl font-semibold text-[#8a4d55] mb-6 text-center">
          Complete Your Profile
        </h2>

        {reduxError && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4">
            {reduxError}
          </div>
        )}

        {/* Show approval status if user just completed registration */}
        {updatedStatus === "pending_details" && (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded-lg mb-6 border border-yellow-300">
            ⏳ Your profile is pending admin approval. We'll notify you once approved!
          </div>
        )}

        <form onSubmit={handleUserSubmit} className="space-y-4">

          {/* Name Row */}
          <div className="flex gap-3">
            <input
              name="firstName"
              placeholder="First Name"
              className="w-full border border-[#eac1bb] rounded-xl px-4 py-3"
              required
            />
            <input
              name="lastName"
              placeholder="Last Name"
              className="w-full border border-[#eac1bb] rounded-xl px-4 py-3"
              required
            />
          </div>

          {/* Business */}
          <input
            name="buisnessName"
            placeholder="Business Name"
            className="w-full border border-[#eac1bb] rounded-xl px-4 py-3"
            required
          />

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full border border-[#eac1bb] rounded-xl px-4 py-3"
            required
          />

          {/* City + State */}
          <div className="flex gap-3">
            <input
              name="city"
              placeholder="City"
              className="w-full border border-[#eac1bb] rounded-xl px-4 py-3"
              required
            />
            <input
              name="state"
              placeholder="State"
              className="w-full border border-[#eac1bb] rounded-xl px-4 py-3"
              required
            />
          </div>

          {/* Verified Phone Display (read-only) */}
          <div className="bg-[#f7e7e2] text-[#8a4d55] px-4 py-3 rounded-xl border border-[#eac1bb]">
            Verified Phone: <strong>{phone}</strong>
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full mt-4 py-3 bg-[#eac1bb] text-[#8a4d55] 
            rounded-full text-lg font-semibold shadow-md hover:bg-[#d9a9a0] transition disabled:opacity-50"
          >
            {status === "loading" ? "Saving..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
