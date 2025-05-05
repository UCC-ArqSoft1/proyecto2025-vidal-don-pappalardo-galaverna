"use client"

import type React from "react"

interface CyberInputProps {
  type?: string
  placeholder?: string
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  name?: string
  required?: boolean
  disabled?: boolean
  className?: string
  min?: number
  max?: number
}

export const CyberInput: React.FC<CyberInputProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  required = false,
  disabled = false,
  className = "",
  min,
  max,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      required={required}
      disabled={disabled}
      min={min}
      max={max}
      className={`cyber-input ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    />
  )
}

export default CyberInput
