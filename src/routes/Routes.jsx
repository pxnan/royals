import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserPage from '../pages/user/UserPage';
import AdminPage from '../pages/admin/AdminPage';
import NotFoundPage from '../pages/notFound/NotFoundPage';
import AdminLatihModel from '../pages/admin/AdminLatihModel';
import KelolaData from '../pages/admin/KelolaData';
import KelolaAdmin from '../pages/admin/KelolaAdmin';
import Login from '../pages/admin/Login';

// Komponen untuk memproteksi route admin
const ProtectedAdminRoute = ({ children }) => {
    const token = localStorage.getItem('admin_token');
    const tokenExpires = localStorage.getItem('token_expires');
    
    // Cek apakah token masih valid
    const isAuthenticated = token && tokenExpires && Date.now() < parseInt(tokenExpires);
    
    if (!isAuthenticated) {
        // Redirect ke halaman login jika belum login
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

// Komponen untuk redirect jika sudah login (untuk halaman login)
const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('admin_token');
    const tokenExpires = localStorage.getItem('token_expires');
    const isAuthenticated = token && tokenExpires && Date.now() < parseInt(tokenExpires);
    
    if (isAuthenticated) {
        // Jika sudah login, redirect ke dashboard admin
        return <Navigate to="/admin" replace />;
    }
    
    return children;
};

const AppRoutes = () => (
    <Router>
        <Routes>
            {/* Halaman User (Public - tidak perlu login) */}
            <Route path="/" element={<UserPage />} />
            
            {/* Halaman Login Admin (Public) */}
            <Route 
                path="/login" 
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                } 
            />
            
            {/* Halaman Admin (Protected - harus login) */}
            <Route 
                path="/admin" 
                element={
                    <ProtectedAdminRoute>
                        <AdminPage />
                    </ProtectedAdminRoute>
                } 
            />
            
            <Route 
                path="/admin/latih-model" 
                element={
                    <ProtectedAdminRoute>
                        <AdminLatihModel />
                    </ProtectedAdminRoute>
                } 
            />
            
            <Route 
                path="/admin/kelola-data" 
                element={
                    <ProtectedAdminRoute>
                        <KelolaData />
                    </ProtectedAdminRoute>
                } 
            />
            
            <Route 
                path="/admin/kelola-admin" 
                element={
                    <ProtectedAdminRoute>
                        <KelolaAdmin />
                    </ProtectedAdminRoute>
                } 
            />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </Router>
);

export default AppRoutes;