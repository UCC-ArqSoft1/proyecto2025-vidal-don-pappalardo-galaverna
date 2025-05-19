"use client"

import type React from "react"

interface CyberTextareaProps {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  name?: string
  required?: boolean
  disabled?: boolean
  className?: string
  rows?: number
}

export const CyberTextarea: React.FC<CyberTextareaProps> = ({
  placeholder,
  value,
  onChange,
  name,
  required = false,
  disabled = false,
  className = "",
  rows = 4,
}) => {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      required={required}
      disabled={disabled}
      rows={rows}
      className={`cyber-textarea ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    />
  )
}

export default CyberTextarea
