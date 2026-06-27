import React from "react";

export function QRCodeMock() {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full opacity-80"
    >
      <rect width="100" height="100" fill="white" />
      <rect
        x="10"
        y="10"
        width="25"
        height="25"
        stroke="#2c2c2c"
        strokeWidth="3"
      />
      <rect x="15" y="15" width="15" height="15" fill="#2c2c2c" />
      <rect
        x="65"
        y="10"
        width="25"
        height="25"
        stroke="#2c2c2c"
        strokeWidth="3"
      />
      <rect x="70" y="15" width="15" height="15" fill="#2c2c2c" />
      <rect
        x="10"
        y="65"
        width="25"
        height="25"
        stroke="#2c2c2c"
        strokeWidth="3"
      />
      <rect x="15" y="70" width="15" height="15" fill="#2c2c2c" />
      <rect x="45" y="10" width="10" height="10" fill="#2c2c2c" />
      <rect x="45" y="30" width="20" height="10" fill="#2c2c2c" />
      <rect x="10" y="45" width="10" height="10" fill="#2c2c2c" />
      <rect x="30" y="45" width="35" height="10" fill="#2c2c2c" />
      <rect x="75" y="45" width="15" height="10" fill="#2c2c2c" />
      <rect x="45" y="65" width="10" height="25" fill="#2c2c2c" />
      <rect x="65" y="65" width="25" height="10" fill="#2c2c2c" />
      <rect x="65" y="80" width="10" height="10" fill="#2c2c2c" />
      <rect x="80" y="80" width="10" height="10" fill="#2c2c2c" />
    </svg>
  );
}
