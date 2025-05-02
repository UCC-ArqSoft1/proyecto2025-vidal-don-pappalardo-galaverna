export const MyActivities = () => {
  // Mismo mock por ahora, en real: solo actividades del usuario
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Mis Actividades</h1>
      {/* Reutilizamos los cards */}
      {["Spinning Intensivo", "Funcional Express"].map((name, i) => (
        <div key={i} className="mb-4 border-b pb-2">
          <h2 className="text-lg font-semibold">{name}</h2>
          <a href={`/detalle/${i + 1}`} className="text-blue-500 underline">Ver detalle</a>
        </div>
      ))}
    </div>
  )
}
