import type React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/home"
import Login from "./pages/login"
import ActivityDetail from "./pages/activity-detail"
import MyActivities from "./pages/my-activities"
import NewActivityPage from "./pages/new-activity-page"
import EditActivityPage from "./pages/edit-activity-page"
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
