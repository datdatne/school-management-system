// ============================================
// FILE: frontend/src/pages/Users/UserCreate.tsx
// MỤC ĐÍCH: Tạo user mới (CHỈ ADMIN)
// ============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../services/api'; // Đường dẫn đã được sửa lại cho chuẩn
import { useAuth } from '../../context/AuthContext';
import './UserEdit.css';

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
    isActive: boolean;
}

function UserCreate() {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth(); // Bốc user từ Context chuẩn

    // Áp dụng Interface vào State
    const [formData, setFormData] = useState<UserFormData>({
        username: '',
        email: '',
        fullname: '',
        password: '',
        roleIds: [],
        isActive: true
    });

    const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // ===== KIỂM TRA QUYỀN ADMIN =====
    const isAdmin = currentUser 
    ? [...(currentUser.roles || [])].some(role => String(role) === 'ROLE_ADMIN') 
    : false;

    // ===== LOAD ROLES & BẢO VỆ ROUTE =====
    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        if (!isAdmin) {
            alert('⛔ Chỉ ADMIN mới có quyền truy cập!');
            navigate('/dashboard');
            return;
        }

        // Chỉ Admin mới được phép gọi API lấy danh sách Role
        const fetchRoles = async () => {
            try {
                const res = await api.get('/roles');
                setAvailableRoles(res.data);
            } catch (err: unknown) {
                console.error('Load roles error:', err);
            }
        };
        fetchRoles();
    }, [currentUser, isAdmin, navigate]);

    // ===== HANDLE CHANGE (Ép kiểu sự kiện chuẩn React) =====
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

        if (!formData.password?.trim()) {
            alert('⚠️ Vui lòng nhập mật khẩu!');
            return;
        }

        try {
            setLoading(true);
            await api.post('/users', formData);

            alert('✅ Tạo user thành công!');
            navigate('/users');

        } catch (err: unknown) {
            console.error('Create error:', err);
            let errorMsg = '❌ Tạo user thất bại!';

            // Guard Axios chuẩn chỉ
            if (axios.isAxiosError(err) && err.response) {
                if (typeof err.response.data === 'string') {
                    errorMsg = err.response.data;
                } else if (err.response.data?.message) {
                    errorMsg = err.response.data.message;
                } else if (err.response.status === 409) {
                    errorMsg = 'Username hoặc email đã tồn tại!';
                }
            } else if (err instanceof Error) {
                errorMsg = err.message;
            }

            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // ===== RENDER =====
    return (
        <div className="user-edit-container">
            <div className="user-edit-header">
                <h1>➕ Tạo User Mới</h1>
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
                    <label>Mật khẩu *</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu..."
                        required
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
                                {/* Xử lý fallback an toàn cho chuỗi */}
                                {(role.name || '').replace('ROLE_', '')}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? '⏳ Đang tạo...' : '➕ Tạo User'}
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

export default UserCreate;