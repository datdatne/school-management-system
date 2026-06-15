// frontend/src/pages/Roles/RoleCreate.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './RoleForm.css';

// ===== KHAI BÁO GIAO KÈO =====
interface RoleFormData {
    name: string;
    description: string;
}

function RoleCreate() {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth(); // Bốc user từ Context chuẩn

    // Áp dụng Interface vào State
    const [formData, setFormData] = useState<RoleFormData>({
        name: '',
        description: ''
    });
    const [loading, setLoading] = useState<boolean>(false);

    // ===== KIỂM TRA QUYỀN ADMIN =====
  // ===== KIỂM TRA QUYỀN ADMIN (Đã fix) =====
const isAdmin = currentUser 
    ? [...(currentUser.roles || [])].some(role => String(role) === 'ROLE_ADMIN') 
    : false;

    // ===== BẢO VỆ ROUTE =====
    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        if (!isAdmin) {
            alert('⛔ Chỉ ADMIN mới có quyền truy cập!');
            navigate('/dashboard');
        }
    }, [currentUser, isAdmin, navigate]);

    // ===== HANDLE CHANGE (Ép kiểu hỗ trợ Input & Textarea) =====
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
            await api.post('/roles', formData);
            alert('✅ Tạo role thành công!');
            navigate('/roles');
        } catch (err: unknown) {
            let errorMsg = 'Tạo role thất bại!';
            
            // Xử lý lỗi chuẩn Axios Guard
            if (axios.isAxiosError(err) && err.response) {
                const data = err.response.data;
                errorMsg = data?.message || (typeof data === 'string' ? data : errorMsg);
            }
            
            alert(`❌ ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="role-form-container">
            <div className="role-form-header">
                <h1>➕ Tạo Role Mới</h1>
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
                        placeholder="VD: ROLE_PARENT"
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
                        rows={4} /* ✅ Đã sửa nháy kép thành ngoặc nhọn */
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? '⏳ Đang tạo...' : '➕ Tạo Role'}
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

export default RoleCreate;