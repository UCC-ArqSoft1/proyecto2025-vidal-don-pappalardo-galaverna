import { Link } from "react-router-dom"
import SportLayout from "../components/layout/CyberLayout"
import { isAuthenticated } from "../utils/auth"

const LandingPage = () => {
  const authenticated = isAuthenticated()

  return (
    <SportLayout>
      <div className="landing-container">
        <section className="hero-section">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bienvenido a Cyber Gym
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-600">
            Tu espacio para mantenerte activo y saludable
          </p>
          {!authenticated && (
            <div className="flex gap-4 justify-center">
              <Link
                to="/login"
                className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/signup"
                className="bg-secondary text-white px-8 py-3 rounded-lg hover:bg-secondary-dark transition-colors"
              >
                Registrarse
              </Link>
            </div>
          )}
        </section>

        <section className="features-section">
          <h2 className="text-3xl font-bold mb-8 text-center">Nuestras Actividades</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card">
              <h3 className="text-xl font-semibold mb-4">Clases Grupales</h3>
              <p className="text-gray-600">
                Participa en nuestras clases grupales dirigidas por instructores profesionales
              </p>
            </div>
            <div className="feature-card">
              <h3 className="text-xl font-semibold mb-4">Entrenamiento Personal</h3>
              <p className="text-gray-600">
                Recibe atención personalizada con nuestros instructores certificados
              </p>
            </div>
            <div className="feature-card">
              <h3 className="text-xl font-semibold mb-4">Actividades Especiales</h3>
              <p className="text-gray-600">
                Disfruta de eventos y actividades especiales organizadas regularmente
              </p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h2>
          <p className="text-xl mb-8 text-gray-600">
            Únete a nuestra comunidad y comienza tu viaje hacia una vida más saludable
          </p>
          <Link
            to={authenticated ? "/actividades" : "/signup"}
            className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors inline-block"
          >
            {authenticated ? "Ver Actividades" : "Registrarse Ahora"}
          </Link>
        </section>
      </div>
    </SportLayout>
  )
}

export default LandingPage 