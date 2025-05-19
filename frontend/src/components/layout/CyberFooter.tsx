import type React from "react"
import { Link } from "react-router-dom"

interface FooterLink {
  to: string
  label: string
}

interface SportFooterProps {
  copyright?: string
  links?: FooterLink[]
}

export const SportFooter: React.FC<SportFooterProps> = ({
  copyright = `© ${new Date().getFullYear()} SPORT GYM`,
  links = [],
}) => {
  return (
    <footer className="sport-footer">
      <div className="sport-footer-text">{copyright}</div>
      {links.length > 0 && (
        <div className="sport-footer-links">
          {links.map((link, index) => (
            <Link key={index} to={link.to} className="sport-footer-link">
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </footer>
  )
}

export default SportFooter
