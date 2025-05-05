import type React from "react"

interface CyberBadgeProps {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "accent"
  className?: string
}

export const CyberBadge: React.FC<CyberBadgeProps> = ({ children, variant = "primary", className = "" }) => {
  const variantClass =
    variant === "secondary" ? "cyber-badge-secondary" : variant === "accent" ? "cyber-badge-accent" : ""

  return <span className={`cyber-badge ${variantClass} ${className}`}>{children}</span>
}

export default CyberBadge
