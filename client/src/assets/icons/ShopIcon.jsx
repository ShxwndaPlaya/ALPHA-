import React from "react";

export default function ShopIcon({ size = 24, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 7h16l-1 13H5L4 7z" />
      <path d="M16 7V4H8v3" />
    </svg>
  );
}
