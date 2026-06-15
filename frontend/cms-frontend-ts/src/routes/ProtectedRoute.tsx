
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

export default function ProtectedRoute() {
    // Nếu có token đăng nhập -> Cho lọt qua cửa để vào các trang con (Outlet)
    // Nếu chưa đăng nhập -> Chặn đứng, đá văng về màn /login lập tức
    return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
}