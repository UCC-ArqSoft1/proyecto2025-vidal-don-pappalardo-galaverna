import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ActivityForm, Activity } from "../components/ActivityForm";

// Simulación de datos iniciales
const mockData: Record<string, Activity> = {
  "1": {
    title: "Funcional",
    description: "Clase intensa",
    photo: "",
    day: "lunes",
    time: "18:00",
    duration: "1h",
    capacity: 20,
    category: "funcional",
    instructor: "Juan",
  },
};

export const EditActivityPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    // Simula fetch
    if (id && mockData[id]) {
      setActivity(mockData[id]);
    }
  }, [id]);

  const handleUpdate = (data: Activity) => {
    console.log("Actualizar actividad:", id, data);
    // Aquí iría el PUT a tu backend
  };

  if (!activity) return <p>Cargando actividad...</p>;

  return <ActivityForm initialData={activity} onSubmit={handleUpdate} />;
};
