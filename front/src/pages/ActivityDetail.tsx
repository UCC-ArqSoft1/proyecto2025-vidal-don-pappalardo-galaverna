import { useParams } from "react-router-dom"
import { mockActivities } from "../mock/activities"

export const ActivityDetail = () => {
  const { id } = useParams()
  const activity = mockActivities.find(a => a.id === Number(id))

  if (!activity) return <p>Actividad no encontrada</p>

  return (
    <div className="p-4">
      <h1 className="text-2xl">{activity.title}</h1>
      <img src={activity.image} alt={activity.title} className="w-full max-w-md my-4" />
      <p><strong>Instructor:</strong> {activity.instructor}</p>
      <p><strong>Duración:</strong> {activity.duration}</p>
      <p><strong>Cupo:</strong> {activity.capacity}</p>
      <p><strong>Categoría:</strong> {activity.category}</p>
      <p className="my-2">{activity.description}</p>
      <button className="bg-green-600 text-white py-2 px-4 rounded">Inscribirme</button>
    </div>
  )
}
