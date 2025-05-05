import type { Activity } from "../types"

export const mockActivities: Activity[] = [
  {
    id: 1,
    title: "Spinning Intensivo",
    description:
      "Clase de ciclismo indoor de alta intensidad con música motivadora. Quema calorías y mejora tu resistencia cardiovascular.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    schedule: "Lunes y Miércoles 18:00",
    duration: "45 min",
    capacity: 25,
    category: "cardio",
    instructor: "Ana Martínez",
  },
  {
    id: 2,
    title: "Yoga Flow",
    description:
      "Secuencia fluida de posturas que conectan movimiento y respiración. Ideal para mejorar flexibilidad y reducir el estrés.",
    image:
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    schedule: "Martes y Jueves 19:30",
    duration: "60 min",
    capacity: 15,
    category: "yoga",
    instructor: "Carlos Ruiz",
  },
  {
    id: 3,
    title: "Funcional Express",
    description:
      "Entrenamiento rápido y efectivo que combina ejercicios funcionales para trabajar todo el cuerpo en poco tiempo.",
    image:
      "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    schedule: "Lunes a Viernes 12:15",
    duration: "30 min",
    capacity: 20,
    category: "funcional",
    instructor: "Diego Sánchez",
  },
  {
    id: 4,
    title: "Pilates Reformer",
    description:
      "Clase de pilates con máquinas reformer para fortalecer el core, mejorar la postura y aumentar la flexibilidad.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    schedule: "Miércoles y Viernes 10:00",
    duration: "50 min",
    capacity: 8,
    category: "pilates",
    instructor: "Laura Gómez",
  },
  {
    id: 5,
    title: "HIIT Challenge",
    description:
      "Entrenamiento por intervalos de alta intensidad que maximiza la quema de calorías y mejora la condición física.",
    image:
      "https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80",
    schedule: "Martes y Jueves 07:00",
    duration: "40 min",
    capacity: 15,
    category: "cardio",
    instructor: "Roberto Fernández",
  },
  {
    id: 6,
    title: "Zumba Party",
    description:
      "Divertida clase de baile con ritmos latinos que te hará quemar calorías mientras disfrutas de la música.",
    image:
      "https://images.unsplash.com/photo-1517130038641-a774d04afb3c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    schedule: "Viernes 20:00",
    duration: "60 min",
    capacity: 30,
    category: "baile",
    instructor: "María López",
  },
]
