// AppRoutes.tsx
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './layouts/Layout';
import HomePage from './Pages/HomePage';
import AdminDashboard from './Pages/AdminDashboard';
import LoginPage from './Pages/LoginPage';
import ProtectedRoute from './auth/ProtectedRoute';
import AdminHouses from './Pages/AdminHouses';
import AdminCalculator from './Pages/AdminCalculator';
import AdminExpenses from './Pages/AdminGastos';
import ProjectDetailPage from "./Pages/ProjectDetailPage";
import EditarCasa from "./Pages/EditarCasa";
import HouseDetail from "./Pages/HouseDetail";


const AppRoutes = () => {
    return (
        <Routes>
            {/* Layout público */}
            <Route element={<Layout showHero={true} />}>
                <Route path="/" element={<HomePage />} />
            </Route>

            {/* Ruta login (sin layout) */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rutas protegidas con layout */}
            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/houses" element={<AdminHouses />} />
                    <Route path="/admin/houses/:id/editar" element={<EditarCasa />} />
                    <Route path="/casa/:id" element={<HouseDetail />} />
                    <Route path="/admin/calculadora" element={<AdminCalculator />} />
                    <Route path="/admin/gastos" element={<AdminExpenses />} />
                    <Route path="/admin/gastos/:id" element={<ProjectDetailPage />} />
                </Route>
            </Route>

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRoutes;
