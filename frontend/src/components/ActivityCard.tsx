import { Activity } from "../types"

export const ActivityCard = ({ activity }: { activity: Activity }) => (
  <div className="border p-4 rounded shadow">
    <h2 className="text-xl font-bold">{activity.title}</h2>
    <p><strong>Horario:</strong> {activity.schedule}</p>
    <p><strong>Profesor:</strong> {activity.instructor}</p>
    <a href={`/detalle/${activity.id}`} className="text-blue-500 underline mt-2 inline-block">Ver más</a>
  </div>
)
