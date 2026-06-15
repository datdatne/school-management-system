// frontend/src/pages/Roles/RoleEdit.tsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './RoleForm.css';

// ===== KHAI BÁO GIAO KÈO =====
interface RoleFormData {
    name: string;
    description: string;
}

function RoleEdit() {
    const { id } = useParams<{ id: string }>(); // Ép kiểu params
    const navigate = useNavigate();
    const { user: currentUser } = useAuth(); // Dùng Context chuẩn

    // Áp dụng Interface vào State
    const [formData, setFormData] = useState<RoleFormData>({
        name: '',
        description: ''
    });
    const [loading, setLoading] = useState<boolean>(true);

    // ===== KIỂM TRA QUYỀN ADMIN =====
    // ===== KIỂM TRA QUYỀN ADMIN (Đã fix) =====
const isAdmin = currentUser 
    ? [...(currentUser.roles || [])].some(role => String(role) === 'ROLE_ADMIN') 
    : false;
    // ===== FETCH DỮ LIỆU (Bọc useCallback) =====
    const fetchRole = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(`/roles/${id}`);
            setFormData({
                name: res.data.name || '',
                description: res.data.description || ''
            });
        } catch (err: unknown) {
            console.error('Fetch role error:', err);
            alert('❌ Không thể tải role!');
            navigate('/roles');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    // ===== BẢO VỆ ROUTE & GỌI API =====
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

        const timeoutId = setTimeout(() => {
            fetchRole();
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [currentUser, isAdmin, navigate, fetchRole]);

    // ===== HANDLE CHANGE (Ép kiểu hỗ trợ cả Input & Textarea) =====
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // ===== SUBMIT FORM =====
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert('⚠️ Vui lòng nhập tên role!');
            return;
        }

        try {
            setLoading(true);
            await api.put(`/roles/${id}`, formData);
            alert('✅ Cập nhật role thành công!');
            navigate('/roles');
        } catch (err: unknown) {
            let errorMsg = 'Cập nhật thất bại!';
            
            // Xử lý lỗi Axios an toàn
            if (axios.isAxiosError(err) && err.response) {
                const data = err.response.data;
                errorMsg = data?.message || (typeof data === 'string' ? data : errorMsg);
            }
            
            alert(`❌ ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading-container">⏳ Đang tải...</div>;
    }

    return (
        <div className="role-form-container">
            <div className="role-form-header">
                <h1>✏️ Chỉnh sửa Role</h1>
                <button onClick={() => navigate('/roles')} className="btn-back">
                    ← Quay lại
                </button>
            </div>

            <form onSubmit={handleSubmit} className="role-form">
                <div className="form-group">
                    <label>Tên Role *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Mô tả</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Mô tả vai trò..."
                        rows={4} /* ✅ Đã sửa ngoặc kép thành ngoặc nhọn chứa số */
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? '⏳ Đang lưu...' : '💾 Lưu thay đổi'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/roles')}
                        className="btn-cancel"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RoleEdit;