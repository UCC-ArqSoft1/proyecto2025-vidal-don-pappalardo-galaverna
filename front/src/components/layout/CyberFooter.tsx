import type React from "react"
import { Link } from "react-router-dom"

interface FooterLink {
  to: string
  label: string
}

interface CyberFooterProps {
  copyright?: string
  links?: FooterLink[]
}

export const CyberFooter: React.FC<CyberFooterProps> = ({
  copyright = `© ${new Date().getFullYear()} CYBER GYM`,
  links = [],
}) => {
  return (
    <footer className="cyber-footer">
      <div className="cyber-footer-text">{copyright}</div>
      {links.length > 0 && (
        <div className="cyber-footer-links">
          {links.map((link, index) => (
            <Link key={index} to={link.to} className="cyber-footer-link">
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </footer>
  )
}

export default CyberFooter
