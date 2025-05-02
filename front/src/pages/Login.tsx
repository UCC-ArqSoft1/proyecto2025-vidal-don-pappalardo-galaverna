export const Login = () => {
  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Iniciar sesión</h1>
      <form className="grid gap-4">
        <input className="border p-2" placeholder="Email" />
        <input className="border p-2" placeholder="Contraseña" type="password" />
        <button className="bg-green-600 text-white py-2 px-4 rounded">Ingresar</button>
      </form>
    </div>
  )
}
