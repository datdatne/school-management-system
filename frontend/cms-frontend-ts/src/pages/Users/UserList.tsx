// ============================================
// FILE: frontend/src/pages/Users/UserList.tsx
// MỤC ĐÍCH: Quản lý danh sách người dùng (CHỈ ADMIN)
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './UserList.css';

// ===== KHAI BÁO KIỂU DỮ LIỆU (TYPESCRIPT) =====
interface Role {
    id ?: number;
    name?: string;
}

interface User {
    id: number;
    username: string;
    email: string;
    fullname: string;
    active: boolean;
    roles: Role[];
}

function UserList() {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    // ===== STATES CÓ ÉP KIỂU =====
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchKeyword, setSearchKeyword] = useState<string>('');

    // State cho modal xóa
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    // ===== KIỂM TRA QUYỀN ADMIN (Chuẩn TS & AuthContext) =====
    const isAdmin = currentUser 
        ? [...(currentUser.roles || [])].some(role => String(role) === 'ROLE_ADMIN') 
        : false;

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        if (!isAdmin) {
            alert('⛔ Bạn không có quyền truy cập vào trang Quản lý Người dùng!');
            navigate('/dashboard');
        }
    }, [currentUser, isAdmin, navigate]);

    // ===== XỬ LÝ LỖI API CHUNG =====
    const handleApiError = (err: unknown) => {
        if (axios.isAxiosError(err)) {
            if (err.response) {
                if (err.response.status === 401) {
                    setError('Token hết hạn! Vui lòng đăng nhập lại.');
                    setTimeout(() => navigate('/login'), 2000);
                } else if (err.response.status === 403) {
                    setError('Bạn không có quyền thực hiện thao tác này!');
                } else {
                    setError(String(err.response.data) || 'Có lỗi xảy ra!');
                }
            } else if (err.request) {
                setError('Không thể kết nối đến server!');
            }
        } else if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('Đã xảy ra lỗi không xác định!');
        }
    };

    // ===== FETCH USERS (Dùng useCallback tránh render loop) =====
    const fetchUsers = useCallback(async () => {
        await Promise.resolve(); // Nhường luồng để tránh lỗi set-state-in-effect
        try {
            setLoading(true);
            setError(null);

            const response = await api.get('/users');
            console.log('=== Dữ liệu users ===', response.data);
            setUsers(response.data);

        } catch (err: unknown) {
            console.error('=== Lỗi khi tải users ===', err);
            handleApiError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // ===== TÌM KIẾM USERS =====
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!searchKeyword.trim()) {
            fetchUsers();
            return;
        }

        await Promise.resolve();
        try {
            setLoading(true);
            setError(null);
            const response = await api.get(`/users/search?keyword=${searchKeyword}`);
            setUsers(response.data);

        } catch (err: unknown) {
            console.error('=== Lỗi khi tìm kiếm ===', err);
            handleApiError(err);
        } finally {
            setLoading(false);
        }
    };

    // ===== XÓA USER =====
    const handleDelete = async (userId: number | undefined) => {
        if (!userId) return;

        try {
            await api.delete(`/users/${userId}`);
            alert('✅ Xóa user thành công!');
            fetchUsers();
            setShowDeleteModal(false);
        } catch (err: unknown) {
            console.error('=== Lỗi khi xóa user ===', err);
            handleApiError(err);
        }
    };

    // ===== KÍCH HOẠT/KHÓA USER =====
    const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
        // Thay getCurrentUser() bằng currentUser bốc từ Context
        if (userId === currentUser?.id) {
            alert('⚠️ Bạn không thể thay đổi trạng thái tài khoản của chính mình!');
            return;
        }

        const action = currentStatus ? 'KHÓA' : 'MỞ KHÓA';
        const confirmMessage = `Bạn có chắc muốn ${action} tài khoản này?`;

        if (!window.confirm(confirmMessage)) {
            return; 
        }

        try {
            setLoading(true);
            await api.patch(`/users/${userId}/toggle-status`);

            setUsers(users.map(user =>
                user.id === userId 
                    ? { ...user, active: !currentStatus }
                    : user
            ));

            alert(`✅ ${action} tài khoản thành công!`);

        } catch (error: unknown) {
            console.error('Toggle status error:', error);
            alert(`❌ Không thể ${action} tài khoản. Vui lòng thử lại!`);
        } finally {
            setLoading(false);
        }
    };

    // ===== MODAL HANDLERS =====
    const openDeleteModal = (user: User) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setUserToDelete(null);
        setShowDeleteModal(false);
    };

    // ===== LOAD USERS KHI MOUNT =====
    useEffect(() => {
        if (currentUser && isAdmin) {
            const timeoutId = setTimeout(() => {
                fetchUsers();
            }, 0);
            return () => clearTimeout(timeoutId);
        }
    }, [currentUser, isAdmin, fetchUsers]);

    // ===== RENDER =====
    return (
        <div className="user-list-container">
            {/* Header */}
            <div className="user-list-header">
                <h1>👥 Quản lý người dùng</h1>
                <div className="header-actions">
                    <button onClick={() => navigate('/users/create')} className="btn-primary">
                        ➕ Tạo user mới
                    </button>
                    <button onClick={() => navigate('/dashboard')} className="btn-back">
                        ← Quay lại
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="🔍 Tìm kiếm theo username, email, fullname..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="search-input"
                />
                <button type="submit" className="btn-search">Tìm kiếm</button>
                <button type="button" onClick={() => { setSearchKeyword(''); fetchUsers(); }} className="btn-reset">
                    Reset
                </button>
            </form>

            {/* Debug Info */}
            <div className="debug-box">
                <h4>🔍 Debug Info:</h4>
                <p>Current User: {currentUser?.username}</p>
               <p>Roles: {[...(currentUser?.roles || [])].map((r: Role) => r.name).join(', ')}</p>
                <p>Loading: {loading.toString()}</p>
                <p>Error: {error ? error : 'None'}</p>
                <p>Số lượng users: {users.length}</p>
            </div>

            {/* LOADING */}
            {loading && (
                <div className="loading-container">
                    <p>⏳ Đang tải dữ liệu...</p>
                </div>
            )}

            {/* ERROR */}
            {error && !loading && (
                <div className="error-message">
                    <strong>❌ Lỗi:</strong> {error}
                </div>
            )}

            {/* DATA */}
            {!loading && !error && (
                <>
                    <div className="user-summary">
                        <p>Tổng số: <strong>{users.length}</strong> users</p>
                    </div>

                    <div className="table-container">
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Họ tên</th>
                                    <th>Roles</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        {/* Đã sửa colSpan thành số */}
                                        <td colSpan={7} className="empty-state">
                                            📭 Không tìm thấy user nào
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user, index) => (
                                        <tr key={user.id}>
                                            <td>{index + 1}</td>
                                            <td><strong>{user.username}</strong></td>
                                            <td>{user.email}</td>
                                            <td>{user.fullname}</td>
                                            <td>
                                                <div className="roles-badges">
                                                    {user.roles && user.roles.map((role) => (
                                                        <span key={role.id} className={`badge badge-${(role.name || '').toLowerCase()}`}>
    {(role.name || '').replace('ROLE_', '')}
</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
                                                    {user.active ? '✅ Active' : '🔒 Locked'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button onClick={() => navigate(`/users/edit/${user.id}`)} className="btn-edit" title="Chỉnh sửa">
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleStatus(user.id, user.active)}
                                                        className={user.active ? 'btn-danger' : 'btn-success'}
                                                        disabled={loading || user.id === currentUser?.id}
                                                        title={user.id === currentUser?.id ? 'Không thể tự thay đổi trạng thái' : (user.active ? 'Khóa tài khoản' : 'Mở tài khoản')}
                                                    >
                                                        {user.active ? '🔓 Khóa' : '🔒 Mở'}
                                                    </button>
                                                    <button onClick={() => openDeleteModal(user)} className="btn-delete" title="Xóa">
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
                </>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={closeDeleteModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>⚠️ Xác nhận xóa user</h3>
                        <p>Bạn có chắc chắn muốn xóa user <strong>{userToDelete?.username}</strong>?</p>
                        <p style={{ color: '#dc2626', fontSize: '14px' }}>⚠️ Hành động này không thể hoàn tác!</p>
                        <div className="modal-actions">
                            <button onClick={() => handleDelete(userToDelete?.id)} className="btn-confirm-delete">
                                Xóa
                            </button>
                            <button onClick={closeDeleteModal} className="btn-cancel">
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserList;