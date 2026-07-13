import { Navigate } from "react-router-dom";
import { estaAutenticado } from "../services/api";

function RotaProtegida({ children }) {
  if (!estaAutenticado()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default RotaProtegida;