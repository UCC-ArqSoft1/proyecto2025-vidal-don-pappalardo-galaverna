"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import SportLayout from "../components/layout/CyberLayout"
import { mockActivities } from "../mock/activities"
import type { Activity } from "../types"

const Home: React.FC = () => {
  const [search, setSearch] = useState<string>("")

  const filtered: Activity[] = mockActivities.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase()),
  )

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
                <img src={activity.image || "/placeholder.svg?height=200&width=400"} alt={activity.title} />
                <div className="sport-card-badge">
                  <span
                    className={`sport-badge ${
                      activity.category === "yoga"
                        ? "sport-badge-accent"
                        : activity.category === "cardio"
                          ? "sport-badge-secondary"
                          : ""
                    }`}
                  >
                    {activity.category.toUpperCase()}
                  </span>
                </div>
              </div>

              <h2 className="sport-card-title">{activity.title}</h2>

              <div className="sport-card-meta">
                <p>
                  <span className="text-primary font-semibold">HORARIO:</span> {activity.schedule}
                </p>
                <p>
                  <span className="text-primary font-semibold">INSTRUCTOR:</span> {activity.instructor}
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
