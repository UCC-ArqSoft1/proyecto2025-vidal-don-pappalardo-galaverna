export const ActivityForm = ({ isEdit = false }: { isEdit?: boolean }) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">{isEdit ? "Editar Actividad" : "Nueva Actividad"}</h1>
      <form className="grid gap-4 max-w-xl">
        <input className="border p-2" placeholder="Título" />
        <input className="border p-2" placeholder="Categoría" />
        <input className="border p-2" placeholder="Horario" />
        <input className="border p-2" placeholder="Duración" />
        <input className="border p-2" placeholder="Cupo" type="number" />
        <input className="border p-2" placeholder="Instructor" />
        <textarea className="border p-2" placeholder="Descripción" />
        <input className="border p-2" type="file" />
        <button className="bg-blue-600 text-white py-2 px-4 rounded">
          {isEdit ? "Guardar Cambios" : "Crear Actividad"}
        </button>
      </form>
    </div>
  )
}
