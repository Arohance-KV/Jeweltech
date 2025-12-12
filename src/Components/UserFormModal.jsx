import React from "react";

const UserFormModal = ({ isOpen, onClose, phone, onSuccess }) => {
  if (!isOpen) return null;

  const handleUserSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const user = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      businessName: formData.get("businessName"),
      phone: phone, // ⬅️ Verified number from OTPModal
      email: formData.get("email"),
      city: formData.get("city"),
      state: formData.get("state"),
    };

    localStorage.setItem("user", JSON.stringify(user));

    if (onSuccess) onSuccess(user);
    onClose();
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
            name="businessName"
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
            className="w-full mt-4 py-3 bg-[#eac1bb] text-[#8a4d55] 
            rounded-full text-lg font-semibold shadow-md hover:bg-[#d9a9a0] transition"
          >
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
