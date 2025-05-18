import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearAuthData } from '../utils/auth'

interface UserMenuProps {
  userName: string
}

export function UserMenu({ userName }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    clearAuthData()
    navigate('/login')
  }

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="user-menu-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {userName}
      </button>
      {isOpen && (
        <div className="user-menu-dropdown">
          <button onClick={handleLogout} className="user-menu-item">
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  )
} 