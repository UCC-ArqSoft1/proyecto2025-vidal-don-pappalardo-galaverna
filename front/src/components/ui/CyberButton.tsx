"use client"

import type React from "react"

interface CyberButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  variant?: "primary" | "secondary" | "accent"
  disabled?: boolean
  className?: string
  fullWidth?: boolean
}

export const CyberButton: React.FC<CyberButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  fullWidth = false,
}) => {
  const variantClass = variant === "secondary" ? "cyber-button-secondary" : ""
  const widthClass = fullWidth ? "w-full" : ""

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`cyber-button ${variantClass} ${widthClass} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  )
}

export default CyberButton
