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
          className="text-xs font-bold mb-1.5 uppercase tracking-wider block"
          style={{ color: '#A08B70' }}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={`w-full rounded-xl px-4 py-3 outline-none transition-all duration-200 text-sm placeholder:font-normal shadow-sm ${
          error ? "border-red-400" : ""
        } ${className}`}
        style={{
          background: '#FAF7F2',
          border: error ? '1px solid #F87171' : '1px solid #EDE5D8',
          color: '#2C2416',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#C4954A';
          e.target.style.boxShadow = '0 0 0 3px rgba(196,149,74,0.12)';
          if (props.onFocus) props.onFocus(e);
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? '#F87171' : '#EDE5D8';
          e.target.style.boxShadow = 'none';
          if (props.onBlur) props.onBlur(e);
        }}
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
