"use client"

import type React from "react"
import { useState } from "react"

interface CyberFileInputProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  name?: string
  accept?: string
  required?: boolean
  disabled?: boolean
  className?: string
  label?: string
}

export const CyberFileInput: React.FC<CyberFileInputProps> = ({
  onChange,
  name,
  accept,
  required = false,
  disabled = false,
  className = "",
  label = "Seleccionar archivo",
}) => {
  const [fileName, setFileName] = useState<string>("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name)
    } else {
      setFileName("")
    }

    if (onChange) {
      onChange(e)
    }
  }

  return (
    <div className={`cyber-file-input ${className}`}>
      <input type="file" onChange={handleChange} name={name} accept={accept} required={required} disabled={disabled} />
      <div className="cyber-file-input-label">{fileName ? fileName : label}</div>
    </div>
  )
}

export default CyberFileInput
