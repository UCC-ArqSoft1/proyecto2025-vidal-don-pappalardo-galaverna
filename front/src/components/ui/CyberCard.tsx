import type React from "react"

interface CyberCardProps {
  children: React.ReactNode
  className?: string
}

export const CyberCard: React.FC<CyberCardProps> = ({ children, className = "" }) => {
  return <div className={`cyber-card ${className}`}>{children}</div>
}

export default CyberCard
