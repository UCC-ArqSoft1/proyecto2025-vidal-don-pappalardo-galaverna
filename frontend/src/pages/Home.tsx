"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import SportLayout from "../components/layout/CyberLayout"
import { activityService } from "../api"
import type { Activity } from "../types"

const Home = () => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true)
      const response = await activityService.getAllActivities()

      if (response.success && response.data) {
        setActivities(response.data)
      } else {
        setError(response.message || "Error al cargar actividades")
      }

      setLoading(false)
    }

    fetchActivities()
  }, [])

  const filtered: Activity[] = activities.filter(
    (a) =>
      a.titulo.toLowerCase().includes(search.toLowerCase()) || a.categoria.toLowerCase().includes(search.toLowerCase()),
  )

  if (loading) {
    return (
      <SportLayout>
        <div className="flex justify-center items-center h-64">
          <div className="sport-spinner"></div>
        </div>
      </SportLayout>
    )
  }

  if (error) {
    return (
      <SportLayout>
        <div className="error-container">
          <h1 className="error-title">ERROR</h1>
          <div className="error-divider"></div>
          <p className="error-message">{error}</p>
        </div>
      </SportLayout>
    )
  }

  return (
    <SportLayout>
      <div className="home-banner">
        <h1>ACTIVIDADES DEPORTIVAS</h1>
        <p>Descubre nuestras clases y actividades para mantenerte en forma y saludable.</p>
        <div className="home-banner-pattern"></div>
      </div>

      <div className="home-search">
        <input
          type="text"
          placeholder="Buscar por nombre o categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sport-input"
        />
      </div>

      <div className="sport-card-grid">
        {filtered.map((activity) => (
          <div key={activity.id} className="sport-card">
            <div className="sport-card-content">
              <div className="sport-card-image">
                <img src={activity.imagen_url || "/placeholder.svg?height=200&width=400"} alt={activity.titulo} />
                <div className="sport-card-badge">
                  <span
                    className={`sport-badge ${
                      activity.categoria === "yoga"
                        ? "sport-badge-accent"
                        : activity.categoria === "cardio"
                          ? "sport-badge-secondary"
                          : ""
                    }`}
                  >
                    {activity.categoria.toUpperCase()}
                  </span>
                </div>
              </div>

              <h2 className="sport-card-title">{activity.titulo}</h2>

              <div className="sport-card-meta">
                <p>
                  <span className="text-primary font-semibold">HORARIO:</span> {activity.horario}
                </p>
                <p>
                  <span className="text-primary font-semibold">DÍA:</span> {activity.dia}
                </p>
              </div>

              <div className="sport-card-actions">
                <Link to={`/detalle/${activity.id}`} className="sport-button sport-button-full">
                  VER DETALLES
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SportLayout>
  )
}

export default Home
