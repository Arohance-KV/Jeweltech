// utils/sendWhatsAppEnquiry.js

export const isWhatsAppDesktop = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes("whatsapp");
};

export const formatEnquiryMessage = ({ items, total }) => {
  let message = `🛍️ *New Product Enquiry*\n\n`;

  items.forEach((item, index) => {
    message +=
      `*${index + 1}. ${item.name || "Product"}*\n` +
      `• Product ID: ${item._id}\n` +
      `• Quantity: ${item.quantity || 1}\n` +
      `• Price: ₹${item.price || "N/A"}\n\n`;
  });

  message += `━━━━━━━━━━━━━━\n`;
  message += `*Total Items:* ${items.length}\n`;
  message += `*Estimated Total:* ₹${total.toLocaleString()}\n\n`;
  message += `📞 Please contact me regarding this enquiry.\n`;

  return message;
};

export const sendWhatsAppEnquiry = async ({
  phoneNumber,
  message,
  onDesktopFallback,
}) => {
  try {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Desktop fallback: copy message
    if (isWhatsAppDesktop()) {
      await navigator.clipboard.writeText(message);
      onDesktopFallback?.();
    }

    window.open(url, "_blank");
  } catch (err) {
    console.error("WhatsApp redirect failed:", err);
    throw err;
  }
};
