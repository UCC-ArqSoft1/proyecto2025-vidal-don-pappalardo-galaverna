import type React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import ActivityDetail from "./pages/ActivityDetail"
import MyActivities from "./pages/MyActivities"
import NewActivityPage from "./pages/NewActivityPage"
import EditActivityPage from "./pages/EditActivityPage"
import "./assets/styles/globals.css"
import "./assets/styles/components.css"
import "./assets/styles/animations.css"
import "./assets/styles/layout.css"
import "./assets/styles/pages.css"

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/detalle/:id" element={<ActivityDetail />} />
        <Route path="/mis-actividades" element={<MyActivities />} />
        <Route path="/nueva-actividad" element={<NewActivityPage />} />
        <Route path="/editar-actividad/:id" element={<EditActivityPage />} />
      </Routes>
    </Router>
  )
}

export default App
