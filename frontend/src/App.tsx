import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ProtectedRoute } from "./components/ProtectedRoute"
import LandingPage from "./pages/LandingPage"
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
import InstructorDetail from "./pages/instructor-detail"
import ActivityForm from "./pages/activity-form"
import ActivityList from "./pages/activity-list"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const App: React.FC = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
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

          <Route
            path="/actividades"
            element={
              <ProtectedRoute>
                <ActivityList />
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
          <Route
            path="/admin/instructores"
            element={
              <ProtectedRoute requireAdmin>
                <InstructorList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/instructores/nuevo"
            element={
              <ProtectedRoute requireAdmin>
                <InstructorForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/instructores/detalle/:id"
            element={
              <ProtectedRoute requireAdmin>
                <InstructorDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  )
}

export default App
