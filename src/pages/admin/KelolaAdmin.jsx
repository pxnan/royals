import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/SidebarAdmin';
import NavbarAdmin from '../../components/NavbarAdmin';
import { getAdmins, createAdmin, updateAdmin, resetAdminPassword, deleteAdmin } from '../../api';

// Skeleton Components
const FilterSkeleton = () => (
    <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="skeleton h-7 w-24"></div>
                <div className="skeleton h-8 w-36"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                    <div className="skeleton h-4 w-20 mb-1"></div>
                    <div className="skeleton h-10 w-full"></div>
                </div>
                <div className="form-control flex flex-row items-end gap-2">
                    <div className="skeleton h-10 w-20"></div>
                    <div className="skeleton h-10 w-20"></div>
                </div>
            </div>
        </div>
    </div>
);

const TableSkeleton = ({ rows = 10, columns = 8 }) => (
    <div className="overflow-x-auto">
        <table className="table w-full">
            <thead>
                <tr className="bg-base-200">
                    {[...Array(columns)].map((_, i) => (
                        <th key={i}><div className="skeleton h-4 w-16"></div></th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {[...Array(rows)].map((_, i) => (
                    <tr key={i}>
                        {[...Array(columns)].map((_, j) => (
                            <td key={j}>
                                <div className="skeleton h-4 w-full"></div>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const PaginationSkeleton = () => (
    <div className="flex justify-center items-center gap-4 mt-6">
        <div className="skeleton h-8 w-24"></div>
        <div className="flex gap-1">
            <div className="skeleton h-8 w-8"></div>
            <div className="skeleton h-8 w-8"></div>
            <div className="skeleton h-8 w-8"></div>
            <div className="skeleton h-8 w-8"></div>
            <div className="skeleton h-8 w-8"></div>
        </div>
        <div className="skeleton h-8 w-24"></div>
    </div>
);

const AccessDeniedSkeleton = () => (
    <div className="card bg-base-100 shadow-xl">
        <div className="card-body text-center py-20">
            <div className="skeleton h-16 w-16 rounded-full mx-auto mb-4"></div>
            <div className="skeleton h-8 w-48 mx-auto mb-2"></div>
            <div className="skeleton h-4 w-96 mx-auto"></div>
            <div className="skeleton h-4 w-80 mx-auto mt-2"></div>
        </div>
    </div>
);

const KelolaAdmin = () => {
    const [admins, setAdmins] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalData, setTotalData] = useState(0);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        full_name: '',
        role: 'admin',
        is_active: true
    });
    const [resetPasswordData, setResetPasswordData] = useState({
        new_password: '',
        confirm_password: ''
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Get current admin data from localStorage
    const currentAdmin = JSON.parse(localStorage.getItem('admin_data') || '{}');
    
    // Cek apakah user adalah super admin
    const isSuperAdmin = currentAdmin.role === 'super_admin';

    // Redirect atau tampilkan pesan jika bukan super admin
    useEffect(() => {
        if (!isSuperAdmin) {
            setError('Anda tidak memiliki izin untuk mengakses halaman ini. Hanya Super Admin yang dapat mengelola admin.');
            setDataLoading(false);
        }
    }, [isSuperAdmin]);

    // Fetch admins data (hanya untuk super admin)
    const fetchAdmins = async (page = 1, searchTerm = '') => {
        if (!isSuperAdmin) return;
        
        setDataLoading(true);
        setError('');
        
        try {
            const token = localStorage.getItem('admin_token');
            const result = await getAdmins(token, page, 10, searchTerm);
            
            setAdmins(result.data);
            setCurrentPage(result.page);
            setTotalPages(result.total_pages);
            setTotalData(result.total_data);
        } catch (err) {
            setError(err.message || 'Gagal mengambil data admin');
            console.error('Error:', err);
        } finally {
            setDataLoading(false);
        }
    };

    useEffect(() => {
        if (isSuperAdmin) {
            fetchAdmins(currentPage, search);
        }
    }, [currentPage, search, isSuperAdmin]);

    const handleSearch = () => {
        setCurrentPage(1);
        fetchAdmins(1, search);
    };

    const handleResetFilter = () => {
        setSearch('');
        setCurrentPage(1);
        fetchAdmins(1, '');
    };

    const handleOpenAddModal = () => {
        setModalMode('add');
        setFormData({
            username: '',
            password: '',
            email: '',
            full_name: '',
            role: 'admin',
            is_active: true
        });
        setShowModal(true);
    };

    const handleOpenEditModal = (admin) => {
        setModalMode('edit');
        setSelectedAdmin(admin);
        setFormData({
            username: admin.username,
            email: admin.email,
            full_name: admin.full_name,
            role: admin.role,
            is_active: admin.is_active === 1 || admin.is_active === true
        });
        setShowModal(true);
    };

    const handleOpenResetPasswordModal = (admin) => {
        setModalMode('reset_password');
        setSelectedAdmin(admin);
        setResetPasswordData({
            new_password: '',
            confirm_password: ''
        });
        setShowModal(true);
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleAddAdmin = async () => {
        if (!formData.username || !formData.password || !formData.email || !formData.full_name) {
            setError('Semua field harus diisi');
            setTimeout(() => setError(''), 3000);
            return;
        }
        
        if (formData.password.length < 6) {
            setError('Password minimal 6 karakter');
            setTimeout(() => setError(''), 3000);
            return;
        }
        
        try {
            const token = localStorage.getItem('admin_token');
            await createAdmin(token, formData);
            
            setSuccess('Admin berhasil ditambahkan');
            setTimeout(() => setSuccess(''), 3000);
            setShowModal(false);
            fetchAdmins(currentPage, search);
        } catch (err) {
            setError(err.message || 'Gagal menambahkan admin');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleEditAdmin = async () => {
        if (!formData.email || !formData.full_name) {
            setError('Email dan Nama Lengkap harus diisi');
            setTimeout(() => setError(''), 3000);
            return;
        }
        
        try {
            const token = localStorage.getItem('admin_token');
            await updateAdmin(token, selectedAdmin.id, {
                email: formData.email,
                full_name: formData.full_name,
                role: formData.role,
                is_active: formData.is_active
            });
            
            setSuccess('Admin berhasil diupdate');
            setTimeout(() => setSuccess(''), 3000);
            setShowModal(false);
            fetchAdmins(currentPage, search);
        } catch (err) {
            setError(err.message || 'Gagal mengupdate admin');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleResetPassword = async () => {
        if (!resetPasswordData.new_password || !resetPasswordData.confirm_password) {
            setError('Password baru harus diisi');
            setTimeout(() => setError(''), 3000);
            return;
        }
        
        if (resetPasswordData.new_password !== resetPasswordData.confirm_password) {
            setError('Password baru tidak cocok');
            setTimeout(() => setError(''), 3000);
            return;
        }
        
        if (resetPasswordData.new_password.length < 6) {
            setError('Password minimal 6 karakter');
            setTimeout(() => setError(''), 3000);
            return;
        }
        
        try {
            const token = localStorage.getItem('admin_token');
            await resetAdminPassword(token, selectedAdmin.id, resetPasswordData.new_password);
            
            setSuccess('Password berhasil direset');
            setTimeout(() => setSuccess(''), 3000);
            setShowModal(false);
        } catch (err) {
            setError(err.message || 'Gagal reset password');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteAdmin = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            await deleteAdmin(token, deleteId);
            
            setSuccess('Admin berhasil dihapus');
            setTimeout(() => setSuccess(''), 3000);
            setShowDeleteModal(false);
            fetchAdmins(currentPage, search);
        } catch (err) {
            setError(err.message || 'Gagal menghapus admin');
            setTimeout(() => setError(''), 3000);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return date.toLocaleString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    };

    const getRoleBadge = (role) => {
        if (role === 'super_admin') {
            return <span className="badge h-auto badge-primary">Super Admin</span>;
        }
        return <span className="badge h-auto badge-secondary">Admin</span>;
    };

    const getStatusBadge = (isActive) => {
        if (isActive) {
            return <span className="badge h-auto badge-success">Aktif</span>;
        }
        return <span className="badge h-auto badge-error">Tidak Aktif</span>;
    };

    // Jika bukan super admin, tampilkan akses ditolak
    if (!isSuperAdmin) {
        return (
            <>
                <div className="drawer lg:drawer-open">
                    <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content">
                        <NavbarAdmin title="Kelola Admin" />
                        <div className="min-h-screen bg-base-200">
                            <div className="drawer-content flex flex-col md:pr-60 md:pl-60">
                                <div className="p-4 md:p-6">
                                    <AccessDeniedSkeleton />
                                </div>
                            </div>
                        </div>
                    </div>
                    <SidebarAdmin />
                </div>
            </>
        );
    }

    return (
        <>
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <NavbarAdmin title="Kelola Admin" />
                    <div className="min-h-screen bg-base-200">
                        <div className="drawer-content flex flex-col md:pr-60 md:pl-60">
                            <div className="p-4 md:p-6">
                                <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 mt-5">
                                    Kelola Admin
                                </h1>
                                <p className="text-center text-gray-600 text-sm md:text-base mb-10">
                                    Kelola akun administrator sistem (Hanya Super Admin)
                                </p>

                                {/* Success Message */}
                                {success && (
                                    <div className="alert alert-success shadow-lg mb-4 animate-pulse">
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{success}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Error Message */}
                                {error && (
                                    <div className="alert alert-error shadow-lg mb-4">
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{error}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Filter Section - Selalu tampil tanpa loading */}
                                <div className="card bg-base-100 shadow-xl mb-6">
                                    <div className="card-body">
                                        <div className="flex justify-between items-center flex-wrap gap-4">
                                            <h2 className="card-title text-lg">Filter Data</h2>
                                            <button 
                                                onClick={handleOpenAddModal}
                                                className="btn btn-primary btn-sm"
                                            >
                                                + Tambah Admin Baru
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text">Cari Admin</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Cari username, email, atau nama..."
                                                    className="input input-bordered"
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                                />
                                            </div>
                                            <div className="form-control flex flex-row items-end gap-2">
                                                <button className="btn btn-primary" onClick={handleSearch}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                    Cari
                                                </button>
                                                <button className="btn btn-outline" onClick={handleResetFilter}>
                                                    Reset
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Data Table - Loading terpisah */}
                                <div className="card bg-base-100 shadow-xl">
                                    <div className="card-body">
                                        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                                            <h2 className="card-title text-xl">
                                                Daftar Administrator
                                                {!dataLoading && <div className="badge badge-info ml-2">{totalData} Admin</div>}
                                                {dataLoading && <div className="skeleton h-5 w-16"></div>}
                                            </h2>
                                        </div>

                                        {dataLoading ? (
                                            <>
                                                <TableSkeleton rows={10} columns={8} />
                                                <PaginationSkeleton />
                                            </>
                                        ) : admins.length === 0 ? (
                                            <p className="text-gray-500 text-center py-8">Tidak ada data admin</p>
                                        ) : (
                                            <>
                                                <div className="overflow-x-auto">
                                                    <table className="table table-zebra w-full">
                                                        <thead>
                                                            <tr className="bg-base-200">
                                                                <th>No</th>
                                                                <th>Username</th>
                                                                <th>Nama Lengkap</th>
                                                                <th>Email</th>
                                                                <th>Role</th>
                                                                <th>Status</th>
                                                                <th>Last Login</th>
                                                                <th className="text-center">Aksi</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {admins.map((admin, idx) => (
                                                                <tr key={admin.id}>
                                                                    <td>{((currentPage - 1) * 10) + idx + 1}</td>
                                                                    <td className="font-medium">{admin.username}</td>
                                                                    <td>{admin.full_name}</td>
                                                                    <td>{admin.email}</td>
                                                                    <td>{getRoleBadge(admin.role)}</td>
                                                                    <td>{getStatusBadge(admin.is_active)}</td>
                                                                    <td className="text-sm">{formatDate(admin.last_login)}</td>
                                                                    <td className="text-center">
                                                                        <div className="flex gap-1 justify-center">
                                                                            <button
                                                                                className="btn btn-xs btn-info"
                                                                                onClick={() => handleOpenEditModal(admin)}
                                                                                title="Edit"
                                                                            >
                                                                                ✏️
                                                                            </button>
                                                                            <button
                                                                                className="btn btn-xs btn-warning"
                                                                                onClick={() => handleOpenResetPasswordModal(admin)}
                                                                                title="Reset Password"
                                                                            >
                                                                                🔑
                                                                            </button>
                                                                            {currentAdmin.username !== admin.username && (
                                                                                <button
                                                                                    className="btn btn-xs btn-error"
                                                                                    onClick={() => handleDeleteClick(admin.id)}
                                                                                    title="Hapus"
                                                                                >
                                                                                    🗑️
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {/* Pagination */}
                                                {totalPages > 1 && (
                                                    <div className="flex justify-center items-center gap-4 mt-6">
                                                        <button
                                                            className="btn btn-sm"
                                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                            disabled={currentPage === 1}
                                                        >
                                                            « Sebelumnya
                                                        </button>
                                                        <div className="flex gap-1">
                                                            {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                                                let pageNum;
                                                                if (totalPages <= 5) {
                                                                    pageNum = i + 1;
                                                                } else if (currentPage <= 3) {
                                                                    pageNum = i + 1;
                                                                } else if (currentPage >= totalPages - 2) {
                                                                    pageNum = totalPages - 4 + i;
                                                                } else {
                                                                    pageNum = currentPage - 2 + i;
                                                                }
                                                                return (
                                                                    <button
                                                                        key={pageNum}
                                                                        className={`btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-ghost'}`}
                                                                        onClick={() => setCurrentPage(pageNum)}
                                                                    >
                                                                        {pageNum}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                        <button
                                                            className="btn btn-sm"
                                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                            disabled={currentPage === totalPages}
                                                        >
                                                            Selanjutnya »
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <SidebarAdmin />
            </div>

            {/* Modal Add Admin */}
            {showModal && modalMode === 'add' && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-md">
                        <h3 className="font-bold text-lg mb-4">Tambah Admin Baru</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="label text-sm font-semibold">Username *</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    placeholder="Masukkan username"
                                />
                            </div>
                            <div>
                                <label className="label text-sm font-semibold">Password *</label>
                                <input
                                    type="password"
                                    className="input input-bordered w-full"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    placeholder="Minimal 6 karakter"
                                />
                            </div>
                            <div>
                                <label className="label text-sm font-semibold">Email *</label>
                                <input
                                    type="email"
                                    className="input input-bordered w-full"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    placeholder="admin@example.com"
                                />
                            </div>
                            <div>
                                <label className="label text-sm font-semibold">Nama Lengkap *</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                    placeholder="Nama lengkap"
                                />
                            </div>
                            <div>
                                <label className="label text-sm font-semibold">Role</label>
                                <select
                                    className="select select-bordered w-full"
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="super_admin">Super Admin</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                />
                                <label className="text-sm">Aktif</label>
                            </div>
                        </div>
                        <div className="modal-action">
                            <button className="btn btn-primary" onClick={handleAddAdmin}>Simpan</button>
                            <button className="btn" onClick={() => setShowModal(false)}>Batal</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Edit Admin */}
            {showModal && modalMode === 'edit' && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-md">
                        <h3 className="font-bold text-lg mb-4">Edit Data Admin</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="label text-sm font-semibold">Username</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full bg-gray-100"
                                    value={formData.username}
                                    disabled
                                />
                                <p className="text-xs text-gray-500 mt-1">Username tidak dapat diubah</p>
                            </div>
                            <div>
                                <label className="label text-sm font-semibold">Email *</label>
                                <input
                                    type="email"
                                    className="input input-bordered w-full"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="label text-sm font-semibold">Nama Lengkap *</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="label text-sm font-semibold">Role</label>
                                <select
                                    className="select select-bordered w-full"
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="super_admin">Super Admin</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                />
                                <label className="text-sm">Aktif</label>
                            </div>
                        </div>
                        <div className="modal-action">
                            <button className="btn btn-primary" onClick={handleEditAdmin}>Simpan</button>
                            <button className="btn" onClick={() => setShowModal(false)}>Batal</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Reset Password */}
            {showModal && modalMode === 'reset_password' && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-md">
                        <h3 className="font-bold text-lg mb-4">Reset Password Admin</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="label text-sm font-semibold">Admin: {selectedAdmin?.username}</label>
                            </div>
                            <div>
                                <label className="label text-sm font-semibold">Password Baru *</label>
                                <input
                                    type="password"
                                    className="input input-bordered w-full"
                                    value={resetPasswordData.new_password}
                                    onChange={(e) => setResetPasswordData({...resetPasswordData, new_password: e.target.value})}
                                    placeholder="Minimal 6 karakter"
                                />
                            </div>
                            <div>
                                <label className="label text-sm font-semibold">Konfirmasi Password Baru *</label>
                                <input
                                    type="password"
                                    className="input input-bordered w-full"
                                    value={resetPasswordData.confirm_password}
                                    onChange={(e) => setResetPasswordData({...resetPasswordData, confirm_password: e.target.value})}
                                    placeholder="Ulangi password baru"
                                />
                            </div>
                        </div>
                        <div className="modal-action">
                            <button className="btn btn-primary" onClick={handleResetPassword}>Reset Password</button>
                            <button className="btn" onClick={() => setShowModal(false)}>Batal</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Konfirmasi Hapus</h3>
                        <p className="py-4">Apakah Anda yakin ingin menghapus admin ini? Tindakan ini tidak dapat dibatalkan.</p>
                        <div className="modal-action">
                            <button className="btn btn-error" onClick={handleDeleteAdmin}>Hapus</button>
                            <button className="btn" onClick={() => setShowDeleteModal(false)}>Batal</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default KelolaAdmin;