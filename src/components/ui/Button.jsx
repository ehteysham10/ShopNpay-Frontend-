import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  isLoading = false,
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none transform active:scale-[0.98] cursor-pointer";

  const variants = {
    primary: "text-white shadow-md hover:shadow-lg",
    secondary: "text-white hover:opacity-90",
    outline: "border text-sm hover:opacity-90",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md",
    ghost: "hover:opacity-80"
  };

  const variantStyles = {
    primary: { background: 'linear-gradient(135deg, #8B6914 0%, #C4954A 50%, #9A7820 100%)', boxShadow: '0 4px 14px rgba(139,105,20,0.30)' },
    secondary: { background: '#6B5B45', color: '#FAF7F2' },
    outline: { background: 'rgba(255,255,255,0.85)', borderColor: '#EDE5D8', color: '#4A3D2C' },
    danger: {},
    ghost: { color: '#6B5B45' }
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-5 py-2.5 text-sm rounded-xl",
    lg: "px-7 py-3.5 text-base rounded-2xl"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      style={variantStyles[variant]}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
