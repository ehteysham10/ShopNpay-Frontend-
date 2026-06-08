import React from "react";

const Input = ({
  label,
  error,
  type = "text",
  className = "",
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full flex flex-col items-start">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider block"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={`w-full border border-slate-200 dark:border-slate-700 focus:border-transparent focus:ring-2 focus:ring-purple-500 rounded-xl px-4 py-3 outline-none transition-all duration-200 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-slate-50 dark:bg-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 ${
          error ? "border-red-400 focus:ring-red-400" : ""
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 mt-1 block font-medium">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
