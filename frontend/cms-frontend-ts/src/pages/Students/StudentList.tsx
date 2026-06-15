// ============================================
// FILE: frontend/src/pages/Students/StudentList.tsx
// MỤC ĐÍCH: Quản lý danh sách sinh viên (CRUD đầy đủ)
// ============================================
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { type StudentResponse } from '../../api/generated/api';
import { useAuth } from '../../context/AuthContext';
import './StudentList.css';

import api from '../../services/api'; 

function StudentList() {
    const navigate = useNavigate();

    // ========================================================
    // 1. LẤY USER TỪ KHO (Thay thế hoàn toàn mớ useEffect cũ)
    // ========================================================
    const { user: currentUser } = useAuth();

    // ========================================================
    // 2. KHAI BÁO STATE CÓ ÉP KIỂU TS (Type Declarations)
    // ========================================================
    const [students, setStudents] = useState<StudentResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // States cho phân trang
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);

    // State cho modal xóa
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [studentToDelete, setStudentToDelete] = useState<StudentResponse | null>(null);

    // ===== KIỂM TRA QUYỀN ADMIN TỐI THƯỢNG =====
    const isAdmin = currentUser && currentUser.roles
        ? Array.from(currentUser.roles).some((role: string | { name?: string; authority?: string }) => {
            if (typeof role === 'string') return role === 'ROLE_ADMIN';
            if (role?.name) return role.name === 'ROLE_ADMIN';
            if (role?.authority) return role.authority === 'ROLE_ADMIN';
            return false;
        })
        : false;
    // ========================================================
    // 3. KIỂM TRA QUYỀN (Rã Set theo chuẩn TS)
    // ========================================================
    const hasRole = (roleName: string) => {
        if (!currentUser || !currentUser.roles) return false;
        // Dã Set ra thành Array và tìm quyền
      return [...currentUser.roles].some((role: { name?: string }) => role.name === roleName);
    };

    const isTeacher = hasRole('ROLE_TEACHER');

    // ========================================================
    // 4. FETCH API
    // ========================================================
    const fetchStudents = async () => {
        try {
           
            setError(null);

            const response = await api.get(`/students?page=${currentPage}&size=${pageSize}&sortBy=id&sortDir=asc`);
            console.log('=== API Response ===', response.data);

            setStudents(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
            setCurrentPage(response.data.number);

        } catch (error) {
            console.error('=== Lỗi khi tải sinh viên ===', error);
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý xuất Excel
    const handleExportExcel = async () => {
        try {
            const response = await api.get('/students/export-excel', {
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;

            const fileName = `Danh_Sach_Sinh_Vien_${new Date().toISOString().slice(0, 10)}.xlsx`;
            link.setAttribute('download', fileName);

            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('=== Lỗi khi xuất file Excel ===', error);
            alert('Có lỗi xảy ra khi xuất file Excel. Vui lòng thử lại!');
        }
    };

    // ===== XỬ LÝ LỖI API =====
    // Ép kiểu err về any để dễ dàng truy cập err.response theo phong cách Axios
    const handleApiError = (err: unknown) => {
    // Kiểm tra xem đây có phải lỗi do Axios (gọi API) ném ra không
    if (axios.isAxiosError(err)) {
        if (err.response) {
            if (err.response.status === 401) {
                setError('Token hết hạn! Vui lòng đăng nhập lại.');
                setTimeout(() => navigate('/login'), 2000);
            } else if (err.response.status === 403) {
                setError('Bạn không có quyền thực hiện thao tác này!');
            } else {
                // Ép kiểu data về string vì Backend thường trả về text lỗi
                setError(String(err.response.data) || 'Có lỗi xảy ra!');
            }
        } else if (err.request) {
            setError('Không thể kết nối đến server!');
        }
    } else if (err instanceof Error) {
        // Nếu là lỗi code JS thông thường
        setError(err.message);
    } else {
        setError('Lỗi không xác định!');
    }
};

    const handleDelete = async (studentId: number | undefined) => {
    if (!studentId) return;
    
    try {
        await api.delete(`/students/${studentId}`);
        alert('✅ Xóa sinh viên thành công!');
        fetchStudents();
        setShowDeleteModal(false);
    } catch (err: unknown) { // Xóa :any, dùng :unknown
        console.error('=== Lỗi khi xóa sinh viên ===', err);
        
        if (axios.isAxiosError(err) && err.response?.data) {
            alert(`❌ ${String(err.response.data)}`);
        } else {
            alert('❌ Không thể xóa sinh viên!');
        }
    }
};

    // ===== HANDLERS CHO MODAL =====
    const openDeleteModal = (student: StudentResponse) => {
        setStudentToDelete(student);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setStudentToDelete(null);
        setShowDeleteModal(false);
    };

    // ===== LOAD STUDENTS =====
    useEffect(() => {
        if (currentUser) {
           // Đặt timeout 0 để đảm bảo fetchStudents chạy sau khi tất cả state đã cập nhật (nhất là currentPage và pageSize)
            const timeoutId = setTimeout(() => {
                fetchStudents();
            }, 0);

            // Dọn dẹp để tránh rò rỉ bộ nhớ
            return () => clearTimeout(timeoutId);
        }
    }, [currentUser, currentPage, pageSize]); // Cập nhật dependency array

    // ===== FORMAT DATE =====
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    // ========================================================
    // RENDER HTML (Đã sửa lỗi colSpan = chuỗi)
    // ========================================================
    return (
        <div className="student-list-container">
            {/* Header */}
            <div className="student-list-header">
                <h1>👨‍🎓 Danh sách sinh viên</h1>

                <div className="header-actions">
                    {isAdmin && (
                        <button onClick={() => navigate('/students/create')} className="btn-primary">
                            ➕ Thêm sinh viên
                        </button>
                    )}

                    <button onClick={() => navigate('/dashboard')} className="btn-back">
                        ← Quay lại
                    </button>
                    
                    <button onClick={handleExportExcel} className="btn-primary" style={{ marginLeft: '10px', backgroundColor: '#10b981', color: 'white' }}>
                        📊 Xuất Excel
                    </button>
                </div>
            </div>

            {/* Debug Info */}
            <div className="debug-box">
                <h4>🔍 Debug Info:</h4>
                <p>Username: {currentUser?.username || 'N/A'}</p>
                <p>Roles: {[...(currentUser?.roles || [])].map((r: { name?: string }) => r.name).join(', ') || 'N/A'}</p>
                <p>Is Admin: {isAdmin.toString()}</p>
                <p>Is Teacher: {isTeacher.toString()}</p>
                <p>Loading: {loading.toString()}</p>
                <p>Error: {error || 'None'}</p>
                <p>Số sinh viên: {students.length}</p>
            </div>

            {/* LOADING */}
            {loading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
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
                    <div className="student-summary">
    <p>Tổng số: <strong>{totalElements}</strong> sinh viên</p>
</div>

                    <div className="table-container">
                        <table className="student-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã SV</th>
                                    <th>Họ tên</th>
                                    <th>Ngày sinh</th>
                                    <th>Email</th>
                                    <th>Điện thoại</th>
                                    <th>Lớp</th>
                                    <th>Ngành</th>
                                    {isAdmin && <th>Thao tác</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {students.length === 0 ? (
                                    <tr>
                                        {/* Sửa lại colSpan thành kiểu số (number) thay vì string */}
                                        <td colSpan={isAdmin ? 9 : 8} className="empty-state">
                                            📭 Không có sinh viên nào trong hệ thống
                                        </td>
                                    </tr>
                                ) : (
                                    students.map((student, index) => (
                                        <tr key={student.id}>
                                            <td>{index + 1}</td>
                                            {/* Chú ý: Các trường này dựa vào tên biến Backend trả về, ví dụ studentcode hay studentCode */}
                                            <td><strong>{student.studentcode}</strong></td>
                                            <td>{student.fullname}</td>
                                            <td>{formatDate(student.dateofbirth)}</td>
                                            <td>{student.email}</td>
                                            <td>{student.phone || '-'}</td>
                                            <td>{student.classname || '-'}</td>
                                            <td>{student.major || '-'}</td>
                                            {isAdmin && (
                                                <td>
                                                    <div className="action-buttons">
                                                        <button onClick={() => navigate(`/students/edit/${student.id}`)} className="btn-edit" title="Chỉnh sửa">
                                                            ✏️
                                                        </button>
                                                        <button onClick={() => openDeleteModal(student)} className="btn-delete" title="Xóa">
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        
                        <div className="pagination">
    {/* ===== KHU VỰC CHỌN SỐ DÒNG HIỂN THỊ ===== */}
    <div className="page-size-selector" style={{ marginRight: '20px' }}>
        <label htmlFor="pageSize" style={{ marginRight: '8px' }}>Hiển thị: </label>
        <select 
            id="pageSize"
            value={pageSize} 
            onChange={(e) => {
                setLoading(true);
                setPageSize(Number(e.target.value));
                setCurrentPage(0); // Bắt buộc: Đổi số dòng là phải reset về trang 1
            }}
            style={{ padding: '4px 8px', borderRadius: '4px' }}
        >
            <option value={5}>5 dòng</option>
            <option value={10}>10 dòng</option>
            <option value={20}>20 dòng</option>
            <option value={50}>50 dòng</option>
        </select>
    </div>

    {/* ===== KHU VỰC NÚT ĐIỀU HƯỚNG ===== */}
<div className="page-navigation" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
    <button 
        onClick={() => {
            setLoading(true); // 1. Bật màn hình loading ngay khi bấm
            setCurrentPage(currentPage - 1); // 2. Lùi trang
        }} 
        disabled={currentPage === 0}
        className="btn-page"
    >
        ← Trang trước
    </button>
    
    <span>Trang <strong>{currentPage + 1}</strong> / {totalPages || 1}</span>
    
    <button 
        onClick={() => {
            setLoading(true); 
            setCurrentPage(currentPage + 1); 
        }} 
        disabled={currentPage >= totalPages - 1}
        className="btn-page"
    >
        Trang sau →
    </button>
</div>
</div>
                    </div>
                </>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={closeDeleteModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>⚠️ Xác nhận xóa sinh viên</h3>
                        <p>
                            Bạn có chắc muốn xóa sinh viên <strong>{studentToDelete?.fullname}</strong> ({studentToDelete?.studentcode})?
                        </p>
                        <p style={{ color: '#dc2626', fontSize: '14px' }}>
                            ⚠️ Hành động này không thể hoàn tác!
                        </p>
                        <div className="modal-actions">
                            <button onClick={() => handleDelete(studentToDelete?.id)} className="btn-confirm-delete">
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

export default StudentList;