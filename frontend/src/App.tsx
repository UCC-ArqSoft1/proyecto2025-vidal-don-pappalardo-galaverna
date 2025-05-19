import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
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
import InstructorList from "./pages/instructor-list"
import InstructorForm from "./pages/instructor-form"
import ActivityForm from "./pages/activity-form"
import ActivityList from "./pages/activity-list"

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

          {/* Admin routes */}
          <Route path="/admin/actividades" element={<ActivityList />} />
          <Route path="/admin/actividades/nueva" element={<ActivityForm />} />
          <Route path="/admin/actividades/:id/editar" element={<ActivityForm isEdit />} />
          <Route path="/admin/instructores" element={<InstructorList />} />
          <Route path="/admin/instructores/nuevo" element={<InstructorForm />} />
        </Routes>
    </Router>
  )
}

export default App
