
import { logout } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './Dashboard.css';
function Dashboard() {
  
  const SWAGGER_URL = "http://localhost:8080/swagger-ui/index.html";
   const { user } = useAuth();
  // ===== HANDLER: Đăng xuất =====
const handleLogout = () => {
    // Gọi hàm logout từ authService để xóa sạch token và user trong LocalStorage
    logout();

    // Đá người dùng về trang login
    window.location.href = '/login';
};
      if (!user) {
         return <Navigate to="/login" replace />;
      }
  return (
        <div className="dashboard-container">
            {/* ===== SIDEBAR ===== */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>📚 CMS</h2>
                    <p>Quản lý sinh viên</p>
                </div>

                <nav className="sidebar-nav">
                    <a href="/dashboard" className="nav-item active">
                        <span className="nav-icon">🏠</span>
                        <span>Dashboard</span>
                    </a>
                    {[...(user?.roles || [])].some(role => ['ROLE_ADMIN', 'ROLE_TEACHER'].includes(String(role))) && (
                        <a href="/students" className="nav-item">
                            <span className="nav-icon">👨‍🎓</span>
                            <span>Quản lý sinh viên</span>
                        </a>
                    )}
                    {[...(user?.roles || [])].some(role => String(role) === 'ROLE_ADMIN') && (
                        <>
                            <a href="/users" className="nav-item">
                                <span className="nav-icon">👥</span>
                                <span>Quản lý người dùng</span>
                            </a>
                            <a href="/roles" className="nav-item">
                                <span className="nav-icon">🔐</span>
                                <span>Phân quyền</span>
                            </a>
                        </>
                    )}

                    <a href="/profile" className="nav-item">
                        <span className="nav-icon">👤</span>
                        <span>Thông tin cá nhân</span>
                    </a>
                    
                    <div className="p-4">
                        <a href={SWAGGER_URL} target="_blank" rel="noopener noreferrer" className="swagger-btn">
                            <div className="swagger-content">
                                <p className="swagger-subtitle">API Documentation</p>
                                <h3 className="swagger-title">Swagger UI</h3>
                            </div>
                            <span className="swagger-arrow">→</span>
                        </a>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <span>🚪</span>
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* ===== MAIN CONTENT ===== */}
            <main className="main-content">
                {/* Header */}
                <header className="main-header">
                    <h1>{user.username}</h1>
                    <div className="user-info">
                        <span className="user-name">Xin chào, {user.fullname || user.username}!</span>
                        <span className="user-role">
                            {/* 👉 FIX 3: Ép kiểu String trước khi gọi hàm replace để không bị sập web */}
                            {[...(user?.roles || [])].map(role => String(role).replace('ROLE_', '')).join(', ')}
                        </span>
                    </div>
                </header>

                {/* Stats Cards */}
                <section className="stats-grid">
                    {[...(user?.roles || [])].some(role => ['ROLE_ADMIN', 'ROLE_TEACHER'].includes(String(role))) && (
                        <div className="stat-card">
                            <div className="stat-icon blue">👨‍🎓</div>
                            <div className="stat-info">
                                <h3>Sinh viên</h3>
                                <p className="stat-number">150</p>
                            </div>
                        </div>
                    )}

                    <div className="stat-card">
                        <div className="stat-icon green">👨‍🏫</div>
                        <div className="stat-info">
                            <h3>Giáo viên</h3>
                            <p className="stat-number">12</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon orange">📚</div>
                        <div className="stat-info">
                            <h3>Lớp học</h3>
                            <p className="stat-number">8</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon purple">📊</div>
                        <div className="stat-info">
                            <h3>Môn học</h3>
                            <p className="stat-number">24</p>
                        </div>
                    </div>
                </section>

                {/* Welcome Section */}
                <section className="welcome-section">
                    <h2>👋 Chào mừng đến với hệ thống!</h2>
                    <p>Đây là trang quản lý sinh viên theo CMS. Bạn có thể:</p>
                    <ul>
                        <li>Xem và quản lý danh sách sinh viên</li>
                        <li>Quản lý người dùng và phân quyền</li>
                        <li>Xem thông tin cá nhân</li>
                    </ul>
                </section>

                {/* Debug Info - XÓA KHI DEPLOY */}
                <section className="debug-section">
                    <h3>🔍 Debug Info (xóa khi deploy):</h3>
                    <pre>{JSON.stringify(user, null, 2)}</pre>
                </section>
            </main>
        </div>
    );
}

export default Dashboard
