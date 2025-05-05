"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import CyberLayout from "../components/CyberLayout"
import { mockActivities } from "../mock/activities"
import type { Activity } from "../types"

const Home: React.FC = () => {
  const [search, setSearch] = useState<string>("")

  const filtered: Activity[] = mockActivities.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <CyberLayout>
      <div className="relative">
        <div className="home-background-orb-1"></div>
        <div className="home-background-orb-2"></div>

        <h1 className="text-5xl mb-8 cyber-header neon-text glitch-effect">ACTIVIDADES</h1>

        <div className="home-search">
          <input
            type="text"
            placeholder="Buscar por nombre o categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="cyber-input"
          />
        </div>

        <div className="cyber-card-grid">
          {filtered.map((activity) => (
            <div key={activity.id} className="cyber-card">
              <div className="cyber-card-content">
                <div className="cyber-card-image">
                  <img src={activity.image || "/placeholder.svg?height=200&width=400"} alt={activity.title} />
                  <div className="cyber-card-image-overlay"></div>
                  <div className="cyber-card-badge">
                    <span
                      className={`cyber-badge ${
                        activity.category === "yoga"
                          ? "cyber-badge-accent"
                          : activity.category === "cardio"
                            ? "cyber-badge-secondary"
                            : ""
                      }`}
                    >
                      {activity.category.toUpperCase()}
                    </span>
                  </div>
                </div>

                <h2 className="cyber-card-title neon-text">{activity.title}</h2>

                <div className="cyber-card-meta">
                  <p>
                    <span className="text-primary">HORARIO:</span> {activity.schedule}
                  </p>
                  <p>
                    <span className="text-primary">INSTRUCTOR:</span> {activity.instructor}
                  </p>
                </div>

                <div className="cyber-card-actions">
                  <Link
                    to={`/detalle/${activity.id}`}
                    className="cyber-button cyber-button-secondary cyber-button-full"
                  >
                    VER DETALLES
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CyberLayout>
  )
}

export default Home
