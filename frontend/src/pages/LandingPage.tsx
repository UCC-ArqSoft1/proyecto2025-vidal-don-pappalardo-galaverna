"use client"
import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import "./LandingPage.css"

const LandingPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const trainersRef = useRef(null)
  const testimonialsRef = useRef(null)
  const membershipRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })
  const isFeaturesInView = useInView(featuresRef, { once: true, amount: 0.3 })
  const isTrainersInView = useInView(trainersRef, { once: true, amount: 0.3 })
  const isTestimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.3 })
  const isMembershipInView = useInView(membershipRef, { once: true, amount: 0.3 })

  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])

  // Check if user is authenticated (placeholder)
  useEffect(() => {
    // Replace with your actual authentication check
    const checkAuth = () => {
      const token = localStorage.getItem("token")
      setIsAuthenticated(!!token)
    }

    checkAuth()
  }, [])

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section ref={heroRef} className="hero-section">
        <div className="hero-bg">
          <div className="hero-overlay"></div>
        </div>

        <motion.div style={{ opacity, scale }} className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-badge"
          >
            <span>Cyber Gym</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-title"
          >
            FORJA TU <span className="text-accent">MEJOR</span> VERSIÓN
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hero-subtitle"
          >
            Transforma tu cuerpo y mente con nuestros entrenadores expertos y equipamiento de última generación
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="hero-buttons"
          >
            {!isAuthenticated ? (
              <>
                <a href="/signup" className="btn btn-primary">
                  Comienza Ahora
                </a>
                <a href="/login" className="btn btn-outline">
                  Iniciar Sesión
                </a>
              </>
            ) : (
              <a href="/actividades" className="btn btn-primary">
                Ver Actividades
              </a>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="scroll-indicator"
          onClick={() => scrollToSection(featuresRef)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="features-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="section-header"
          >
            <h2>Nuestras Actividades</h2>
            <p>Descubre todas las actividades que tenemos para ayudarte a alcanzar tus objetivos</p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 * index }}
                className="feature-card"
              >
                <div className="feature-icon">
                  <feature.icon />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <a href={feature.link} className="feature-link">
                  Saber más
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="arrow-icon"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section">
        <div className="section-container">
          <div className="video-container">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="video-thumbnail"
            >
              <div className="play-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5 3L19 12L5 21V3Z"
                    fill="white"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trainers Section */}
      <section ref={trainersRef} className="trainers-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isTrainersInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="section-header"
          >
            <h2>Nuestros Entrenadores</h2>
            <p>Profesionales certificados listos para guiarte en tu camino</p>
          </motion.div>

          <div className="trainers-grid">
            {trainers.map((trainer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isTrainersInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 * index }}
                className="trainer-card"
              >
                <div className="trainer-image" style={{ backgroundImage: `url(${trainer.image})` }}>
                  <div className="trainer-info">
                    <h3>{trainer.name}</h3>
                    <p>{trainer.specialty}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="testimonials-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isTestimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="section-header"
          >
            <h2>Lo Que Dicen Nuestros Miembros</h2>
            <p>Historias reales de transformación y éxito</p>
          </motion.div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isTestimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 * index }}
                className="testimonial-card"
              >
                <div className="testimonial-header">
                  <div className="testimonial-avatar" style={{ backgroundImage: `url(${testimonial.avatar})` }}></div>
                  <div className="testimonial-author">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.title}</p>
                  </div>
                </div>
                <p className="testimonial-quote">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section ref={membershipRef} className="membership-section">
        <div className="membership-bg">
          <div className="membership-overlay"></div>
        </div>

        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isMembershipInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="section-header"
          >
            <h2>Únete a Cyber Gym</h2>
            <p>Elige el plan que mejor se adapte a tus objetivos y comienza tu transformación hoy</p>
          </motion.div>

          <div className="membership-grid">
            {memberships.map((membership, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isMembershipInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 * index }}
                className={`membership-card ${membership.featured ? "membership-featured" : ""}`}
              >
                {membership.featured && <div className="membership-badge">Más Popular</div>}
                <h3>{membership.name}</h3>
                <div className="membership-price">
                  <span className="price">${membership.price}</span>
                  <span className="period">/mes</span>
                </div>
                <ul className="membership-features">
                  {membership.features.map((feature, i) => (
                    <li key={i}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="check-icon"
                      >
                        <path
                          d="M5 13L9 17L19 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a href="/signup" className={`btn ${membership.featured ? "btn-primary" : "btn-secondary"}`}>
                  Elegir Plan
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="cta-content"
          >
            <h2>¿Listo para comenzar?</h2>
            <p>Únete a nuestra comunidad y comienza tu viaje hacia una vida más saludable</p>
            <a href={isAuthenticated ? "/actividades" : "/signup"} className="btn btn-primary btn-large">
              {isAuthenticated ? "Ver Actividades" : "Registrarse Ahora"}
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// Icon Components
const DumbbellIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.5 6.5H17.5M6.5 17.5H17.5M7 12H17M4 9.5V14.5M20 9.5V14.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const UsersIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21M22 21V19C21.9993 18.1137 21.7044 17.2528 21.1614 16.5523C20.6184 15.8519 19.8581 15.3516 19 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const CalendarIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// Data
const features = [
  {
    title: "Entrenamiento Funcional",
    description:
      "Mejora tu fuerza, resistencia y movilidad con ejercicios que imitan los movimientos de la vida diaria.",
    icon: DumbbellIcon,
    link: "/actividades/funcional",
  },
  {
    title: "Clases Grupales",
    description:
      "Participa en nuestras clases dirigidas por instructores profesionales y disfruta entrenando en grupo.",
    icon: UsersIcon,
    link: "/actividades/clases",
  },
  {
    title: "Entrenamiento Personal",
    description: "Recibe atención personalizada con nuestros instructores certificados para alcanzar tus objetivos.",
    icon: CalendarIcon,
    link: "/actividades/personal",
  },
]

const trainers = [
  {
    name: "Carlos Mendoza",
    specialty: "Entrenador de Fuerza",
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=500&auto=format&fit=crop",
  },
  {
    name: "Laura Sánchez",
    specialty: "Instructora de Fitness",
    image: "https://images.unsplash.com/photo-1609899537878-88d5ba429bdb?q=80&w=500&auto=format&fit=crop",
  },
  {
    name: "Miguel Ángel",
    specialty: "Nutricionista Deportivo",
    image: "https://images.unsplash.com/photo-1567013127542-490d757e6349?q=80&w=500&auto=format&fit=crop",
  },
]

const testimonials = [
  {
    name: "Ana García",
    title: "Miembro desde 2022",
    quote:
      "Desde que me uní a Cyber Gym, he perdido 15 kilos y he ganado mucha más energía. Los entrenadores son increíbles y siempre te motivan a dar lo mejor.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Roberto Fernández",
    title: "Miembro desde 2021",
    quote:
      "El ambiente en Cyber Gym es inigualable. He probado muchos gimnasios antes, pero ninguno tiene el nivel de equipamiento y atención personalizada que ofrecen aquí.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "María López",
    title: "Miembro desde 2023",
    quote:
      "Las clases grupales son mi parte favorita. Siempre hay algo nuevo que probar y los instructores hacen que cada sesión sea divertida y desafiante.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "Javier Martínez",
    title: "Miembro desde 2020",
    quote:
      "Gracias al plan nutricional y el entrenamiento personalizado, he logrado aumentar mi masa muscular y mejorar mi rendimiento deportivo significativamente.",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
]

const memberships = [
  {
    name: "Básico",
    price: 29.99,
    features: [
      "Acceso a sala de musculación",
      "Horario limitado (8AM - 4PM)",
      "Evaluación inicial",
      "Acceso a app móvil",
    ],
    featured: false,
  },
  {
    name: "Premium",
    price: 49.99,
    features: [
      "Acceso ilimitado 24/7",
      "Todas las clases grupales",
      "Evaluaciones mensuales",
      "Plan nutricional básico",
      "Acceso a app móvil",
    ],
    featured: true,
  },
  {
    name: "Elite",
    price: 79.99,
    features: [
      "Acceso ilimitado 24/7",
      "Todas las clases grupales",
      "2 sesiones PT mensuales",
      "Plan nutricional personalizado",
      "Acceso a app móvil y áreas VIP",
    ],
    featured: false,
  },
]

export default LandingPage
