import React, { useState } from "react";

export type Activity = {
  title: string;
  description: string;
  photo: string;
  day: string;
  time: string;
  duration: string;
  capacity: number;
  category: string;
  instructor: string;
};

type Props = {
  initialData?: Activity;
  onSubmit: (data: Activity) => void;
};

export const ActivityForm: React.FC<Props> = ({ initialData, onSubmit }) => {
  const [form, setForm] = useState<Activity>(
    initialData || {
      title: "",
      description: "",
      photo: "",
      day: "",
      time: "",
      duration: "",
      capacity: 0,
      category: "",
      instructor: "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="title" value={form.title} onChange={handleChange} placeholder="Título" required className="border p-2 w-full" />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descripción" required className="border p-2 w-full" />
      <input name="photo" value={form.photo} onChange={handleChange} placeholder="URL de la foto" className="border p-2 w-full" />
      <input name="day" value={form.day} onChange={handleChange} placeholder="Día (ej: lunes)" required className="border p-2 w-full" />
      <input name="time" value={form.time} onChange={handleChange} placeholder="Horario (ej: 18:00)" required className="border p-2 w-full" />
      <input name="duration" value={form.duration} onChange={handleChange} placeholder="Duración (ej: 1h)" required className="border p-2 w-full" />
      <input name="capacity" type="number" value={form.capacity} onChange={handleChange} placeholder="Cupo" required className="border p-2 w-full" />
      <input name="category" value={form.category} onChange={handleChange} placeholder="Categoría (ej: funcional)" required className="border p-2 w-full" />
      <input name="instructor" value={form.instructor} onChange={handleChange} placeholder="Instructor" required className="border p-2 w-full" />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Guardar
      </button>
    </form>
  );
};
