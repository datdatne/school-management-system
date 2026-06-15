
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

export default function PublicRoute() {
    // Nếu người dùng ĐÃ đăng nhập rồi mà cố tình gõ URL /login -> Đá họ thẳng vào /dashboard
    // Nếu chưa đăng nhập -> Cho phép hiển thị trang Login (Outlet)
    return isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Outlet />;
}