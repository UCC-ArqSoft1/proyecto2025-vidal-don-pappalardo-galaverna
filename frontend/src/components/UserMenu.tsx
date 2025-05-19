import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearAuthData, isAdmin } from '../utils/auth'
import { userService, activityService } from '../services/api'

interface UserMenuProps {
  userName: string
}

export function UserMenu({ userName }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const admin = isAdmin()

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

  const handleDeleteInstructor = async (instructorId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este instructor?')) {
      try {
        const response = await userService.deleteInstructor(instructorId)
        if (response.success) {
          alert('Instructor eliminado exitosamente')
          navigate('/admin/instructores')
        } else {
          alert(response.message || 'Error al eliminar el instructor')
        }
      } catch (error) {
        alert('Error al eliminar el instructor')
      }
    }
  }

  const handleDeleteActivity = async (activityId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta actividad?')) {
      try {
        const response = await activityService.deleteActivity(activityId)
        if (response.success) {
          alert('Actividad eliminada exitosamente')
          navigate('/admin/actividades')
        } else {
          alert(response.message || 'Error al eliminar la actividad')
        }
      } catch (error) {
        alert('Error al eliminar la actividad')
      }
    }
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
          {admin && (
            <>
              <div className="user-menu-section">
                <div className="user-menu-section-title">Administración</div>
                <button 
                  onClick={() => navigate('/admin/instructores')} 
                  className="user-menu-item"
                >
                  Gestionar Instructores
                </button>
                <button 
                  onClick={() => navigate('/admin/actividades')} 
                  className="user-menu-item"
                >
                  Gestionar Actividades
                </button>
              </div>
              <div className="user-menu-divider" />
            </>
          )}
          <button onClick={handleLogout} className="user-menu-item">
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  )
} 