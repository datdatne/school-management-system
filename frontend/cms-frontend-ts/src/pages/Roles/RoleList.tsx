// frontend/src/pages/Roles/RoleList.tsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './RoleList.css';

// ===== KHAI BÁO GIAO KÈO TYPESCRIPT =====
interface Role {
    id: number;
    name: string;
    description?: string;
}

function RoleList() {
    // ===== STATES CÓ ÉP KIỂU =====
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const navigate = useNavigate();
    const { user: currentUser } = useAuth(); // Dùng Context thay cho localStorage

    // ===== KIỂM TRA QUYỀN ADMIN =====
    // ===== KIỂM TRA QUYỀN ADMIN (Đã fix) =====
const isAdmin = currentUser 
    ? [...(currentUser.roles || [])].some(role => String(role) === 'ROLE_ADMIN') 
    : false;

    // ===== FETCH ROLES (Có bọc useCallback tránh loop) =====
    const fetchRoles = useCallback(async () => {
        await Promise.resolve(); 
        try {
            setLoading(true);
            const res = await api.get('/roles');
            setRoles(res.data);
        } catch (err: unknown) {
            console.error('=== Lỗi khi tải roles ===', err);
            if (axios.isAxiosError(err)) {
                setError(typeof err.response?.data === 'string' ? err.response.data : 'Không thể tải roles!');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Đã xảy ra lỗi không xác định!');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // ===== XỬ LÝ QUYỀN VÀ TỰ ĐỘNG LOAD =====
    useEffect(() => {
        // Trạm 1: Chưa login
        if (!currentUser) {
            navigate('/login');
            return;
        }

        // Trạm 2: Không phải Admin
        if (!isAdmin) {
            alert('⛔ Chỉ ADMIN mới có quyền truy cập trang này!');
            navigate('/dashboard');
            return;
        }

        // Hợp lệ thì gọi API lấy dữ liệu thông qua setTimeout để chiều lòng ESLint
        const timeoutId = setTimeout(() => {
            fetchRoles();
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [currentUser, isAdmin, navigate, fetchRoles]);

    // ===== XÓA ROLE =====
    const handleDelete = async (id: number) => {
        if (!window.confirm('⚠️ Xác nhận xóa role này?')) return;

        try {
            await api.delete(`/roles/${id}`);
            alert('✅ Xóa role thành công!');
            fetchRoles();
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response) {
                alert(typeof err.response.data === 'string' ? err.response.data : '❌ Không thể xóa role!');
            } else {
                alert('❌ Không thể kết nối đến máy chủ!');
            }
        }
    };

    // ===== RENDER =====
    if (loading) return <div className="loading-container">⏳ Đang tải...</div>;
    if (error) return <div className="error-message">❌ {error}</div>;

    return (
        <div className="role-list-container">
            <div className="role-list-header">
                <h1>🔐 Quản lý Roles</h1>
                <div className="header-actions">
                    <button onClick={() => navigate('/roles/create')} className="btn-primary">
                        ➕ Tạo Role
                    </button>
                    <button onClick={() => navigate('/dashboard')} className="btn-back">
                        ← Quay lại
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table className="role-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên Role</th>
                            <th>Mô tả</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.length === 0 ? (
                            <tr>
                                {/* Đã sửa colSpan thành kiểu số chuẩn TS */}
                                <td colSpan={4} className="empty-state">
                                    📭 Không có role nào
                                </td>
                            </tr>
                        ) : (
                            roles.map((role, index) => (
                                <tr key={role.id}>
                                    <td>{index + 1}</td>
                                    <td><strong>{role.name}</strong></td>
                                    <td>{role.description || '-'}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                onClick={() => navigate(`/roles/edit/${role.id}`)}
                                                className="btn-edit"
                                                title="Chỉnh sửa"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(role.id)}
                                                className="btn-delete"
                                                title="Xóa"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default RoleList;