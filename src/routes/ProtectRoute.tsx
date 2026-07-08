import { Navigate, Outlet } from "react-router-dom";

export default function ProtectRoute() { 
    const token = localStorage.getItem("token");
    const usuario = localStorage.getItem("usuario");
    
    if (!token || !usuario) {
            return <Navigate to="/" replace />;
        }

        return <Outlet />;
}