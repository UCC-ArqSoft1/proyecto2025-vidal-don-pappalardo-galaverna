import type React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ProtectedRoute } from "./components/ProtectedRoute"
import Home from "./pages/Home"
import Login from "./pages/Login"
import ActivityDetail from "./pages/activity-detail"
import MyActivities from "./pages/my-activities"
import NewActivityPage from "./pages/new-activity-page"
import EditActivityPage from "./pages/edit-activity-page"
import "./assets/styles/globals.css"
import "./assets/styles/components.css"
import "./assets/styles/animations.css"
import "./assets/styles/layout.css"
import "./assets/styles/pages.css"
import Signup from "./pages/signup"

const App: React.FC = () => {
  return (
    <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/detalle/:id" element={<ActivityDetail />} />

          {/* Protected routes */}
          <Route
            path="/mis-actividades"
            element={
              <ProtectedRoute>
                <MyActivities />
              </ProtectedRoute>
            }
          />

          {/* Admin only routes */}
          <Route
            path="/nueva-actividad"
            element={
              <ProtectedRoute requireAdmin>
                <NewActivityPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editar-actividad/:id"
            element={
              <ProtectedRoute requireAdmin>
                <EditActivityPage />
              </ProtectedRoute>
            }
          />
        </Routes>
    </Router>
  )
}

export default App
