// ============================================
// FILE: frontend/src/pages/Users/UserEdit.tsx
// MỤC ĐÍCH: Chỉnh sửa thông tin user (CHỈ ADMIN)
// ============================================

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './UserEdit.css'; // Dùng chung CSS

// ===== KHAI BÁO GIAO KÈO TYPESCRIPT =====
interface Role {
    id?: number;
    name?: string;
}

interface UserFormData {
    username: string;
    email: string;
    fullname: string;
    password?: string;
    roleIds: number[];
}

function UserEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth(); // Lấy user chuẩn từ Context

    // Áp dụng Interface vào State
    const [formData, setFormData] = useState<UserFormData>({
        username: '',
        email: '',
        fullname: '',
        password: '',
        roleIds: []
    });

    const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // ===== KIỂM TRA QUYỀN ADMIN =====
    const isAdmin = currentUser 
    ? [...(currentUser.roles || [])].some(role => String(role) === 'ROLE_ADMIN') 
    : false;

    // ===== LOAD DỮ LIỆU USER & ROLES =====
    useEffect(() => {
        // Bảo vệ Route
        if (!currentUser) {
            navigate('/login');
            return;
        }

        if (!isAdmin) {
            alert('⛔ Chỉ ADMIN mới có quyền truy cập!');
            navigate('/dashboard');
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Dùng Promise.all để gọi 2 API cùng lúc cho nhanh
                const [userRes, rolesRes] = await Promise.all([
                    api.get(`/users/${id}`),
                    api.get('/roles')
                ]);

                const userData = userRes.data;

                setFormData({
                    username: userData.username || '',
                    email: userData.email || '',
                    fullname: userData.fullname || '',
                    password: '', // Khi edit thì mặc định pass trống (chỉ gửi nếu user muốn đổi)
                    // Rã đông Set và lọc cẩn thận đề phòng id bị undefined
                    roleIds: [...(userData.roles || [])]
                        .map((r: Role) => r.id)
                        .filter((roleId): roleId is number => roleId !== undefined)
                });

                setAvailableRoles(rolesRes.data);

            } catch (err: unknown) {
                console.error('Load error:', err);
                if (axios.isAxiosError(err)) {
                    setError(typeof err.response?.data === 'string' ? err.response.data : 'Không thể load dữ liệu!');
                } else if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Đã xảy ra lỗi không xác định!');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, currentUser, isAdmin, navigate]);

    // ===== HANDLE CHANGE (Ép kiểu sự kiện Input) =====
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // ===== HANDLE ROLE CHANGE =====
    const handleRoleChange = (roleId: number) => {
        setFormData(prev => ({
            ...prev,
            roleIds: prev.roleIds.includes(roleId)
                ? prev.roleIds.filter(id => id !== roleId)
                : [...prev.roleIds, roleId]
        }));
    };

    // ===== SUBMIT (Ép kiểu sự kiện Form) =====
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.roleIds.length === 0) {
            alert('⚠️ Vui lòng chọn ít nhất 1 role!');
            return;
        }

        try {
            setLoading(true);

            // Dùng Partial để có thể bỏ thuộc tính password nếu không cập nhật
            const updateData: Partial<UserFormData> = {
                username: formData.username,
                email: formData.email,
                fullname: formData.fullname,
                roleIds: formData.roleIds
            };

            // Chỉ đính kèm password vào request nếu người dùng thực sự nhập chữ mới
            if (formData.password?.trim()) {
                updateData.password = formData.password;
            }

            await api.put(`/users/${id}`, updateData);

            alert('✅ Cập nhật user thành công!');
            navigate('/users');

        } catch (err: unknown) {
            console.error('Update error:', err);
            let errorMsg = '❌ Cập nhật thất bại!';

            // Bắt lỗi chuẩn bằng Axios
            if (axios.isAxiosError(err) && err.response) {
                if (typeof err.response.data === 'string') {
                    errorMsg = err.response.data;
                } else if (err.response.data?.message) {
                    errorMsg = err.response.data.message;
                }
            }

            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // ===== RENDER UI =====
    if (loading) return <div className="loading-container"><p>⏳ Đang tải dữ liệu...</p></div>;
    if (error) return <div className="error-message"><strong>❌ Lỗi:</strong> {error}</div>;

    return (
        <div className="user-edit-container">
            <div className="user-edit-header">
                <h1>✏️ Chỉnh sửa User</h1>
                <button onClick={() => navigate('/users')} className="btn-back">
                    ← Quay lại
                </button>
            </div>

            <form onSubmit={handleSubmit} className="user-edit-form">
                <div className="form-group">
                    <label>Username *</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Họ tên *</label>
                    <input
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Mật khẩu mới (để trống nếu không đổi)</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu mới..."
                    />
                </div>

                <div className="form-group">
                    <label>Roles *</label>
                    <div className="roles-checkboxes">
                        {availableRoles.map(role => (
                            <label key={role.id} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={formData.roleIds.includes(role.id!)}
                                    onChange={() => handleRoleChange(role.id!)}
                                />
                                {(role.name || '').replace('ROLE_', '')}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? '⏳ Đang lưu...' : '💾 Lưu thay đổi'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/users')}
                        className="btn-cancel"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UserEdit;