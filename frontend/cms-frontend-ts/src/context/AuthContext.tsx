import React, { createContext, useContext, useState } from 'react';
import { type UserResponse } from '../api/generated/api';
import { getCurrentUser } from '../services/authService';

const AuthContext = createContext<{ user: UserResponse | null }>({ user: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // chọc xuống localstorage để lấy user hiện tại (nếu có)
  const [user] = useState<UserResponse | null>(() => getCurrentUser() as UserResponse | null);
  //tạo ra một cái rạp provider để bọc quanh app, cung cấp giá trị user cho tất cả component con
  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
    // sử dụng AuthContext.Provider để cung cấp giá trị user cho toàn bộ ứng dụng (bọc quanh BrowserRouter trong App.tsx)
  );
};

// Dùng "bùa" khóa miệng ESLint đúng tại dòng này
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);