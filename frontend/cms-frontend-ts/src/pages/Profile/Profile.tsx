// ============================================
// FILE: frontend/src/pages/Profile/Profile.tsx
// MỤC ĐÍCH: Hiển thị thông tin cá nhân (Đã nâng cấp chuẩn TypeScript)
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext'; // Bốc user từ Context chuẩn
import './Profile.css';

// ===== KHAI BÁO GIAO KÈO TYPESCRIPT =====
interface Role {
    id?: number;
    name: string;
}

interface StudentData {
    id?: number;
    studentcode?: string;
    studentCode?: string; // Đề phòng API trả về camelCase
    dateofbirth?: string;
    dateOfBirth?: string;
    phone?: string;
    classname?: string;
    className?: string;
    major?: string;
    address?: string;
    email?: string;
}

interface UserProfile {
    id?: number;
    username: string;
    email: string;
    fullname: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    roles?: Role[];
    student?: StudentData; // Cắm thêm thông tin sinh viên nếu có
}

function Profile() {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth(); // Thay thế hoàn toàn getCurrentUser() cũ

    // ===== STATES CÓ ÉP KIỂU =====
    const [profileData, setProfileData] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<unknown>(null);

    // ===== LẤY THÔNG TIN CÁ NHÂN =====
    const fetchProfile = useCallback(async () => {
        // Trạm kiểm duyệt ban đầu
        if (!currentUser || !currentUser.username) {
            setError('Không tìm thấy thông tin đăng nhập!');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setDebugInfo(currentUser); // Vẫn giữ lại Debug cho bạn dễ test

            // 1. Lấy thông tin tài khoản chung
            const userResponse = await api.get(`/users/username/${currentUser.username}`);
            const userData: UserProfile = userResponse.data;

            // 2. Kiểm tra xem có thẻ Sinh viên không
            const hasStudentRole = userData.roles?.some(
                (role: Role) => role.name === 'ROLE_STUDENT'
            );

            if (hasStudentRole) {
                try {
                    // Mẹo: Dùng try-catch lồng để nếu lỗi API student thì user vẫn xem được thông tin cơ bản
                    const studentsResponse = await api.get('/students');
                    const studentData = studentsResponse.data.find(
                        (s: StudentData) => s.email === userData.email
                    );

                    if (studentData) {
                        userData.student = studentData;
                    }
                } catch  {
                    console.log('⚠️ Student data not found or API error');
                }
            }

            setProfileData(userData);

        } catch (err: unknown) {
            console.error('=== ERROR ===', err);
            
            // Xử lý lỗi Axios an toàn tuyệt đối
            if (axios.isAxiosError(err) && err.response) {
                if (err.response.status === 401) {
                    setError('Phiên đăng nhập hết hạn!');
                } else if (err.response.status === 404) {
                    setError(`Không tìm thấy user với username: ${currentUser.username}`);
                } else {
                    const errorMsg = typeof err.response.data === 'string' ? err.response.data : err.message;
                    setError('Lỗi: ' + errorMsg);
                }
            } else if (err instanceof Error) {
                setError('Lỗi hệ thống: ' + err.message);
            } else {
                setError('Đã xảy ra lỗi không xác định!');
            }
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    // Chạy fetchProfile khi component mount
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchProfile();
        }, 0);
        return () => clearTimeout(timeoutId);
    }, [fetchProfile]);

    // ===== FORMAT HELPERS =====
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const formatRoleName = (roleName: string) => {
        const roleMap: Record<string, string> = {
            'ROLE_ADMIN': 'Quản trị viên',
            'ROLE_TEACHER': 'Giảng viên',
            'ROLE_STUDENT': 'Sinh viên'
        };
        return roleMap[roleName] || roleName;
    };

    // ===== RENDER =====
    return (
        <div className="profile-container">
            {/* Header */}
            <div className="profile-header">
                <h1>👤 Thông tin cá nhân</h1>
                <button onClick={() => navigate('/dashboard')} className="btn-back">
                    ← Quay lại
                </button>
            </div>

            {/* DEBUG BOX */}
            <div className="debug-box">
                <h4>🔍 Debug Info:</h4>
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>

            {/* Loading */}
            {loading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>⏳ Đang tải thông tin...</p>
                </div>
            )}

            {/* Error */}
            {error && !loading && (
                <div className="error-message">
                    <strong>❌ Lỗi:</strong> {error}
                </div>
            )}

            {/* Profile Data */}
            {!loading && !error && profileData && (
                <div className="profile-card">
                    {/* Avatar Section */}
                    <div className="profile-avatar-section">
                        <div className="avatar-circle">
                            {profileData.fullname?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <h2>{profileData.fullname || 'N/A'}</h2>
                        <div className="role-badges">
                            {profileData.roles?.map((role, index) => (
                                <span key={index} className={`role-badge role-${role.name.toLowerCase()}`}>
                                    {formatRoleName(role.name)}
                                </span>
                            ))}
                        </div>
                        <div className="status-badge">
                            {profileData.isActive ? (
                                <span className="status-active">✓ Đang hoạt động</span>
                            ) : (
                                <span className="status-inactive">✗ Đã khóa</span>
                            )}
                        </div>
                    </div>

                    {/* User Info Section */}
                    <div className="profile-info-section">
                        <h3>📋 Thông tin tài khoản</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Tên đăng nhập:</label>
                                <span>{profileData.username}</span>
                            </div>
                            <div className="info-item">
                                <label>Email:</label>
                                <span>{profileData.email}</span>
                            </div>
                            <div className="info-item">
                                <label>Họ và tên:</label>
                                <span>{profileData.fullname || '-'}</span>
                            </div>
                            <div className="info-item">
                                <label>Ngày tạo:</label>
                                <span>{formatDate(profileData.createdAt)}</span>
                            </div>
                            <div className="info-item">
                                <label>Cập nhật lần cuối:</label>
                                <span>{formatDate(profileData.updatedAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Student Info Section */}
                    {profileData.student && (
                        <div className="profile-info-section">
                            <h3>🎓 Thông tin sinh viên</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Mã sinh viên:</label>
                                    <span><strong>{profileData.student.studentcode || profileData.student.studentCode}</strong></span>
                                </div>
                                <div className="info-item">
                                    <label>Ngày sinh:</label>
                                    <span>{formatDate(profileData.student.dateofbirth || profileData.student.dateOfBirth)}</span>
                                </div>
                                <div className="info-item">
                                    <label>Điện thoại:</label>
                                    <span>{profileData.student.phone || '-'}</span>
                                </div>
                                <div className="info-item">
                                    <label>Lớp:</label>
                                    <span>{profileData.student.classname || profileData.student.className || '-'}</span>
                                </div>
                                <div className="info-item">
                                    <label>Ngành:</label>
                                    <span>{profileData.student.major || '-'}</span>
                                </div>
                                <div className="info-item full-width">
                                    <label>Địa chỉ:</label>
                                    <span>{profileData.student.address || '-'}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="profile-actions">
                        <button
                            onClick={() => alert('Chức năng đang phát triển!')}
                            className="btn-edit-profile"
                        >
                            ✏️ Chỉnh sửa thông tin
                        </button>
                        <button
                            onClick={() => alert('Chức năng đang phát triển!')}
                            className="btn-change-password"
                        >
                            🔒 Đổi mật khẩu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;