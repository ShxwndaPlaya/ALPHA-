import React from "react";

export default function AdminIcon({ size = 24, className = "" }) {
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
      <path d="M12 2l7 4v6a9 9 0 0 1-14 7a9 9 0 0 1-3-7V6z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
