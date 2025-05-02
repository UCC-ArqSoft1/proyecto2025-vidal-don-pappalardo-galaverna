import { Activity } from "../types"

export const mockActivities: Activity[] = [
  {
    id: 1,
    title: "Spinning Intensivo",
    category: "Spinning",
    schedule: "Lunes 18:00",
    instructor: "Prof. Carla Gómez",
    duration: "45 min",
    capacity: 20,
    description: "Clase de alta intensidad en bicicletas fijas.",
    image: "/spinning.jpg",
  },
  {
    id: 2,
    title: "Funcional Express",
    category: "Funcional",
    schedule: "Martes 19:00",
    instructor: "Prof. Juan Pérez",
    duration: "30 min",
    capacity: 15,
    description: "Entrenamiento funcional de cuerpo completo.",
    image: "/funcional.jpg",
  },
]
