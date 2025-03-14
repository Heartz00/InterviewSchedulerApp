import React from "react";

export const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};



export const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={`p-6 rounded-lg shadow-lg transition-transform ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const Input = ({ className, ...props }) => {
  return (
    <input
      className={`w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${className}`}
      {...props}
    />
  );
};
