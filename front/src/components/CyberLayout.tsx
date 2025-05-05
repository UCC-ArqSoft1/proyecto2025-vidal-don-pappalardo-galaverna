import type React from "react"
import CyberNavbar from "./CyberNavbar"
import CyberFooter from "./CyberFooter"
import type { NavLink, FooterLink } from "../types"

interface CyberLayoutProps {
  children: React.ReactNode
  navLinks?: NavLink[]
  footerLinks?: FooterLink[]
}

const CyberLayout: React.FC<CyberLayoutProps> = ({ children, navLinks, footerLinks }) => {
  const defaultNavLinks: NavLink[] = [
    { to: "/", label: "Inicio" },
    { to: "/mis-actividades", label: "Mis Actividades" },
    { to: "/nueva-actividad", label: "Nueva Actividad" },
    { to: "/login", label: "Login" },
  ]

  const defaultFooterLinks: FooterLink[] = [
    { to: "/terminos", label: "Términos" },
    { to: "/privacidad", label: "Privacidad" },
    { to: "/contacto", label: "Contacto" },
  ]

  return (
    <div className="cyber-layout">
      <CyberNavbar links={navLinks || defaultNavLinks} />
      <main className="cyber-main">{children}</main>
      <CyberFooter links={footerLinks || defaultFooterLinks} />
    </div>
  )
}

export default CyberLayout
