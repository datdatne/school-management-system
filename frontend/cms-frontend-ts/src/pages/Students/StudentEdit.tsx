// ============================================
// FILE: frontend/src/pages/Students/StudentEdit.js
// MỤC ĐÍCH: Form chỉnh sửa thông tin sinh viên (chỉ ADMIN)
// ============================================
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { getCurrentUser } from '../../services/authService';
import './StudentForm.css';

function StudentEdit() {
    const navigate = useNavigate();
    const { id } = useParams(); // Lấy ID từ URL
    const currentUser = getCurrentUser();

    // Kiểm tra quyền ADMIN
    const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');

    // State cho form
    const [formData, setFormData] = useState({
        studentcode: '',
        fullname: '',
        dateofbirth: '',
        email: '',
        phone: '',
        address: '',
        major: '',
        classname: ''
    });

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Nếu không phải ADMIN, redirect
    useEffect(() => {
        if (!isAdmin) {
            alert('⛔ Bạn không có quyền truy cập trang này!');
            navigate('/students');
        }
    }, [isAdmin, navigate]);

    // Fetch student data
    useEffect(() => {
        const fetchStudent = async () => {
            try {
                setLoadingData(true);
                const response = await api.get(`/students/${id}`);

                console.log('=== Student data ===', response.data);

                // Format date cho input type="date"
                let dateForInput = '';
                if (response.data.dateofbirth) {
                    const date = new Date(response.data.dateofbirth);
                    dateForInput = date.toISOString().split('T')[0];
                }

                setFormData({
                    studentcode: response.data.studentcode || '',
                    fullname: response.data.fullname || '',
                    dateofbirth: dateForInput,
                    email: response.data.email || '',
                    phone: response.data.phone || '',
                    address: response.data.address || '',
                    major: response.data.major || '',
                    classname: response.data.classname || ''
                });

            } catch (err) {
                console.error('=== Lỗi khi tải sinh viên ===', err);
                setError('Không thể tải thông tin sinh viên!');
            } finally {
                setLoadingData(false);
            }
        };

        if (id) {
            fetchStudent();
        }
    }, [id]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate
        if (!formData.fullname || !formData.email) {
            alert('⚠️ Vui lòng điền đầy đủ các trường bắt buộc!');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Gọi API
            await api.put(`/students/${id}`, formData);

            alert('✅ Cập nhật sinh viên thành công!');
            navigate('/students');

        } catch (err: unknown) { // 1. Khai báo rõ ràng kiểu unknown cho err
    console.error('=== Lỗi khi cập nhật sinh viên ===', err);

    // 2. Dùng Axios Guard để kiểm tra lỗi từ server trả về
    if (axios.isAxiosError(err)) {
        if (err.response && err.response.data) {
            // 3. Ép kiểu dữ liệu về String để an toàn nhét vào setError
            setError(String(err.response.data));
        } else {
            setError('Không thể cập nhật sinh viên do lỗi mạng!');
        }
    } else if (err instanceof Error) {
        // 4. Nếu là lỗi code JavaScript thông thường
        setError(err.message);
    } else {
        setError('Đã xảy ra lỗi không xác định!');
    }
} finally {
    setLoading(false);
}
    };

    // Loading state
    if (loadingData) {
        return (
            <div className="student-form-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>⏳ Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="student-form-container">
            <div className="form-header">
                <h1>✏️ Chỉnh sửa sinh viên</h1>
                <button
                    onClick={() => navigate('/students')}
                    className="btn-back"
                >
                    ← Quay lại
                </button>
            </div>

            {error && (
                <div className="error-message">
                    <strong>❌ Lỗi:</strong> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="student-form">
                <div className="form-grid">
                    {/* Mã sinh viên (KHÔNG CHO CHỈNH SỬA) */}
                    <div className="form-group">
                        <label htmlFor="studentcode">Mã sinh viên</label>
                        <input
                            type="text"
                            id="studentcode"
                            name="studentcode"
                            value={formData.studentcode}
                            disabled
                            className="input-disabled"
                        />
                        <small className="form-hint">⚠️ Mã sinh viên không thể thay đổi</small>
                    </div>

                    {/* Họ tên */}
                    <div className="form-group">
                        <label htmlFor="fullname">
                            Họ và tên <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="fullname"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label htmlFor="email">
                            Email <span className="required">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Ngày sinh */}
                    <div className="form-group">
                        <label htmlFor="dateofbirth">Ngày sinh</label>
                        <input
                            type="date"
                            id="dateofbirth"
                            name="dateofbirth"
                            value={formData.dateofbirth}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Điện thoại */}
                    <div className="form-group">
                        <label htmlFor="phone">Điện thoại</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Lớp */}
                    <div className="form-group">
                        <label htmlFor="classname">Lớp</label>
                        <input
                            type="text"
                            id="classname"
                            name="classname"
                            value={formData.classname}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Ngành */}
                    <div className="form-group">
                        <label htmlFor="major">Ngành học</label>
                        <input
                            type="text"
                            id="major"
                            name="major"
                            value={formData.major}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Địa chỉ */}
                    <div className="form-group full-width">
                        <label htmlFor="address">Địa chỉ</label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={loading}
                    >
                        {loading ? '⏳ Đang lưu...' : '💾 Cập nhật'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/students')}
                        className="btn-cancel"
                        disabled={loading}
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}

export default StudentEdit;