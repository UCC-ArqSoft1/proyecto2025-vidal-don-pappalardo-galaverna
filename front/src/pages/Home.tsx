import { useState } from "react"
import { mockActivities } from "../mock/activities"
import { ActivityCard } from "../components/ActivityCard"

export const Home = () => {
  const [search, setSearch] = useState("")
  const filtered = mockActivities.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Actividades Deportivas</h1>
      <input
        type="text"
        placeholder="Buscar por nombre o categoría..."
        className="border p-2 mb-4 w-full"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map(act => <ActivityCard key={act.id} activity={act} />)}
      </div>
    </div>
  )
}
