// ============================================
// FILE: frontend/src/pages/Students/StudentCreate.js
// MỤC ĐÍCH: Form tạo sinh viên mới (chỉ ADMIN)
// ============================================

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './StudentForm.css';

function StudentCreate() {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    // Kiểm tra quyền ADMIN
    const isAdmin = ([...(currentUser?.roles || [])].some(role => role.name === 'ROLE_ADMIN'));

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
    const [error, setError] = useState(null);

    // Nếu không phải ADMIN, redirect
    React.useEffect(() => {
        if (!isAdmin) {
            alert('⛔ Bạn không có quyền truy cập trang này!');
            navigate('/students');
        }
    }, [isAdmin, navigate]);

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
        if (!formData.studentcode || !formData.fullname || !formData.email) {
            alert('⚠️ Vui lòng điền đầy đủ các trường bắt buộc!');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Gọi API
            await api.post('/students', formData);

            alert('✅ Tạo sinh viên thành công!');
            navigate('/students');

        } catch (err: unknown) { // Đảm bảo ghi rõ kiểu unknown ở đây
    console.error('=== Lỗi khi tạo sinh viên ===', err);

    // 1. Kiểm tra xem lỗi có phải do Axios (API) ném ra không
    if (axios.isAxiosError(err)) {
        if (err.response && err.response.data) {
            // Ép kiểu về string để hiện câu thông báo lỗi từ Backend trả về
            alert(`❌ ${String(err.response.data)}`);
        } else {
            alert('❌ Không thể kết nối đến máy chủ!');
        }
    } else if (err instanceof Error) {
        // 2. Nếu là lỗi logic JS thông thường
        alert(`❌ Lỗi hệ thống: ${err.message}`);
    } else {
        alert('❌ Đã xảy ra lỗi không xác định!');
    }
}
    };

    return (
        <div className="student-form-container">
            <div className="form-header">
                <h1>➕ Thêm sinh viên mới</h1>
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
                    {/* Mã sinh viên */}
                    <div className="form-group">
                        <label htmlFor="studentcode">
                            Mã sinh viên <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="studentcode"
                            name="studentcode"
                            value={formData.studentcode}
                            onChange={handleChange}
                            placeholder="VD: SV001"
                            required
                        />
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
                            placeholder="VD: Nguyễn Văn A"
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
                            placeholder="VD: student@example.com"
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
                            placeholder="VD: 0123456789"
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
                            placeholder="VD: CNTT K65"
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
                            placeholder="VD: Công nghệ thông tin"
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
                            placeholder="VD: 123 Đường ABC, Quận XYZ, Hà Nội"
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
                        {loading ? '⏳ Đang lưu...' : '💾 Lưu'}
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

export default StudentCreate;