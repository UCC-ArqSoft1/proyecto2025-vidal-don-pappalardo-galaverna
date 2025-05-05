import type React from "react"
import CyberNavbar from "./CyberNavbar"
import CyberFooter from "./CyberFooter"

interface CyberLayoutProps {
  children: React.ReactNode
}

export const CyberLayout: React.FC<CyberLayoutProps> = ({ children }) => {
  const navLinks = [
    { to: "/", label: "Inicio" },
    { to: "/mis-actividades", label: "Mis Actividades" },
    { to: "/nueva-actividad", label: "Nueva Actividad" },
    { to: "/login", label: "Login" },
  ]

  const footerLinks = [
    { to: "/terminos", label: "Términos" },
    { to: "/privacidad", label: "Privacidad" },
    { to: "/contacto", label: "Contacto" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <CyberNavbar links={navLinks} />
      <main className="flex-grow cyber-container">{children}</main>
      <CyberFooter links={footerLinks} />
    </div>
  )
}

export default CyberLayout
