import type React from "react"
import { Link } from "react-router-dom"
import type { FooterLink } from "../types"

interface CyberFooterProps {
  copyright?: string
  links?: FooterLink[]
}

const CyberFooter: React.FC<CyberFooterProps> = ({ copyright, links = [] }) => {
  return (
    <footer className="cyber-footer">
      <div className="cyber-footer-text">{copyright || `© ${new Date().getFullYear()} CYBER GYM`}</div>
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
