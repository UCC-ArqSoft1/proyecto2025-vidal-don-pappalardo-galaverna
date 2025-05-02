import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { ActivityDetail } from "./pages/ActivityDetail";
import { MyActivities } from "./pages/MyActivities";
import { Login } from "./pages/Login";
import { NewActivityPage } from "./pages/NewActivityPage";
import { EditActivityPage } from "./pages/EditActivityPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detalle/:id" element={<ActivityDetail />} />
        <Route path="/mis-actividades" element={<MyActivities />} />
        <Route path="/admin/nueva" element={<NewActivityPage />} />
        <Route path="/admin/editar/:id" element={<EditActivityPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
