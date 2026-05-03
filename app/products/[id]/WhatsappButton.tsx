"use client";

interface Props {
  waUrl: string;
  productId: string;
  productName: string;
  productCategory: string;
  productPrice: number;
  inStock: boolean;
}

export default function WhatsappButton({
  waUrl,
  productId,
  productName,
  productCategory,
  productPrice,
  inStock,
}: Props) {
  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        // @ts-ignore
        window.gtag?.("event", "whatsapp_click", {
          product_id: productId,
          product_name: productName,
          product_category: productCategory,
          product_price: productPrice,
        });
      }}
      className={`block w-full text-white font-bold py-4 rounded-xl text-center text-lg transition-colors ${
        inStock === false
          ? "bg-gray-400 pointer-events-none"
          : "bg-green-700 hover:bg-green-800"
      }`}
    >
      {inStock === false ? "المنتج غير متوفر" : "💬 الطلب عبر الواتساب"}
    </a>
  );
}