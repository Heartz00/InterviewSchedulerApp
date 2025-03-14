import React from "react";

export const Button = ({ children, onClick, disabled, className }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded ${className}`}
  >
    {children}
  </button>
);

export const Card = ({ children, className }) => (
  <div className={`border p-4 ${className}`}>{children}</div>
);

export const Input = ({ type, placeholder, value, onChange, className }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`border p-2 w-full ${className}`}
  />
);
