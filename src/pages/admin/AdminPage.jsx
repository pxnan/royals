import React, { useState, useEffect } from "react";
import SidebarAdmin from "../../components/SidebarAdmin";
import NavbarAdmin from "../../components/NavbarAdmin";
import { getStats, getUnknownQuestions, getKategori, cekCSV } from "../../api";

const AdminPage = () => {
    const [stats, setStats] = useState({
        totalQuestions: 0,
        totalCategories: 0,
        unknownQuestions: 0,
        modelStatus: 'Loading...'
    });

    const [recentUnknown, setRecentUnknown] = useState([]);
    const [recentData, setRecentData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError('');
        try {
            // ✅ Gunakan endpoint /api/stats untuk data statistik utama
            const statsData = await getStats();

            setStats({
                totalQuestions: statsData.total_questions || 0,
                totalCategories: statsData.total_categories || 0,
                unknownQuestions: statsData.total_unknown_questions || 0,
                modelStatus: statsData.model_loaded ? 'Active' : 'Inactive'
            });

            // Ambil data lain yang tidak disediakan oleh /stats
            const unknownData = await getUnknownQuestions(1, 5);
            const kategoriData = await getKategori();
            const csvData = await cekCSV();

            setCategories(kategoriData.kategori || []);

            if (unknownData && unknownData.data) {
                setRecentUnknown(unknownData.data.slice(0, 5));
            }

            if (csvData && csvData.last_5_rows) {
                const rows = csvData.last_5_rows || [];
                const recentRows = rows.slice(1).map(row => ({
                    pertanyaan: row[0] || '',
                    jawaban: row[1] ? (row[1].substring(0, 50) + (row[1].length > 50 ? '...' : '')) : '',
                    kategori: row[2] || ''
                }));
                setRecentData(recentRows);
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.message || 'Gagal memuat data dashboard');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return date.toLocaleString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    };

    if (loading) {
        return (
            <>
                <div className="drawer lg:drawer-open">
                    <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content">
                        <NavbarAdmin title="Dashboard" />
                        <div className="min-h-screen flex justify-center items-center">
                            <span className="loading loading-spinner loading-lg"></span>
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
                    <NavbarAdmin title="Dashboard Admin" />
                    <div className="min-h-screen bg-base-200">
                        <div className="drawer-content flex flex-col md:pr-60 md:pl-60">
                            <div className="p-3 sm:p-4 md:p-6">
                                {/* Header */}
                                <div className="mb-4 md:mb-8">
                                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-1 md:mb-2">
                                        Dashboard Admin
                                    </h1>
                                    <p className="text-center text-gray-600 text-xs sm:text-sm md:text-base">
                                        Selamat datang di panel admin Royal's Resto Chatbot
                                    </p>
                                </div>

                                {error && (
                                    <div className="alert alert-error shadow-lg mb-4 md:mb-6">
                                        <div className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-xs sm:text-sm">{error}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Stat Cards */}
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    {/* Total Pertanyaan */}
                                    <div className="bg-base-100 rounded-xl shadow-md p-3 border border-base-200">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-gray-500 text-xs font-medium">Total Pertanyaan</p>
                                                <p className="text-2xl font-bold text-primary mt-1">{stats.totalQuestions}</p>
                                            </div>
                                            <div className="text-primary">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Kategori */}
                                    <div className="bg-base-100 rounded-xl shadow-md p-3 border border-base-200">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-gray-500 text-xs font-medium">Total Kategori</p>
                                                <p className="text-2xl font-bold text-secondary mt-1">{stats.totalCategories}</p>
                                            </div>
                                            <div className="text-secondary">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pertanyaan Tidak Dikenali */}
                                    <div className="bg-base-100 rounded-xl shadow-md p-3 border border-base-200">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-gray-500 text-xs font-medium">Tidak Dikenali</p>
                                                <p className="text-2xl font-bold text-warning mt-1">{stats.unknownQuestions}</p>
                                            </div>
                                            <div className="text-warning">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Model */}
                                    <div className="bg-base-100 rounded-xl shadow-md p-3 border border-base-200">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-gray-500 text-xs font-medium">Status Model</p>
                                                <p className="text-lg font-bold text-success mt-1">{stats.modelStatus}</p>
                                            </div>
                                            <div className="text-success">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Unknown */}
                                <div className="card bg-base-100 shadow-xl mb-4 md:mb-8">
                                    <div className="card-body p-3 sm:p-4 md:p-6">
                                        <h2 className="card-title text-base sm:text-lg md:text-xl mb-2 md:mb-4">
                                            Pertanyaan Tidak Dikenali Terbaru
                                            <div className="badge badge-warning ml-1 sm:ml-2 text-xs">{stats.unknownQuestions} Total</div>
                                        </h2>
                                        {recentUnknown.length === 0 ? (
                                            <p className="text-gray-500 text-center py-4 md:py-6 text-xs sm:text-sm">
                                                Tidak ada pertanyaan tidak dikenal. Semua pertanyaan berhasil dijawab!
                                            </p>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="table table-zebra w-full text-xs sm:text-sm">
                                                    <thead>
                                                        <tr className="text-xs">
                                                            <th className="w-12 sm:w-16">ID</th>
                                                            <th className="min-w-[120px]">Pertanyaan</th>
                                                            <th className="w-24 sm:w-32">Tanggal</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {recentUnknown.map((item) => (
                                                            <tr key={item.id}>
                                                                <td className="text-xs sm:text-sm">{item.id}</td>
                                                                <td className="break-words text-xs sm:text-sm">{item.pertanyaan}</td>
                                                                <td className="text-[10px] sm:text-xs whitespace-nowrap">{formatDate(item.created_at)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                        {stats.unknownQuestions > 0 && (
                                            <div className="card-actions justify-end mt-2 sm:mt-4">
                                                <a href="/admin/input-pertanyaan?tab=unknown" className="btn btn-xs sm:btn-sm btn-outline btn-warning">
                                                    Lihat Semua
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Recent Data */}
                                <div className="card bg-base-100 shadow-xl mb-4 md:mb-8">
                                    <div className="card-body p-3 sm:p-4 md:p-6">
                                        <h2 className="card-title text-base sm:text-lg md:text-xl mb-2 md:mb-4">
                                            Data Terbaru yang Ditambahkan
                                            <div className="badge badge-info ml-1 sm:ml-2 text-xs">5 Terakhir</div>
                                        </h2>
                                        {recentData.length === 0 ? (
                                            <p className="text-gray-500 text-center py-4 md:py-6 text-xs sm:text-sm">
                                                Belum ada data yang ditambahkan.
                                            </p>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="table table-zebra w-full text-xs sm:text-sm">
                                                    <thead>
                                                        <tr className="text-xs">
                                                            <th className="min-w-[100px]">Pertanyaan</th>
                                                            <th className="min-w-[120px]">Jawaban</th>
                                                            <th className="w-20 sm:w-24">Kategori</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {recentData.map((item, idx) => (
                                                            <tr key={idx}>
                                                                <td className="break-words text-xs sm:text-sm">{item.pertanyaan}</td>
                                                                <td className="break-words text-xs sm:text-sm">{item.jawaban}</td>
                                                                <td><span className="badge badge-outline badge-xs sm:badge-sm">{item.kategori || '-'}</span></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                        <div className="card-actions justify-end mt-2 sm:mt-4">
                                            <a href="/admin/input-pertanyaan?tab=add" className="btn btn-xs sm:btn-sm btn-primary">
                                                + Tambah Pertanyaan Baru
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mt-4 md:mt-8">
                                    <div className="card bg-primary text-primary-content shadow-xl">
                                        <div className="card-body p-3 sm:p-4 md:p-6">
                                            <h2 className="card-title text-sm sm:text-base md:text-lg">Tambah Data</h2>
                                            <p className="text-xs sm:text-sm">Tambah pertanyaan dan jawaban baru ke dataset</p>
                                            <div className="card-actions justify-end mt-2">
                                                <a href="/admin/input-pertanyaan?tab=add" className="btn btn-outline btn-xs sm:btn-sm text-white">
                                                    Tambah Sekarang
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card bg-secondary text-secondary-content shadow-xl">
                                        <div className="card-body p-3 sm:p-4 md:p-6">
                                            <h2 className="card-title text-sm sm:text-base md:text-lg">Latih Model</h2>
                                            <p className="text-xs sm:text-sm">Latih ulang model chatbot dengan data terbaru</p>
                                            <div className="card-actions justify-end mt-2">
                                                <a href="/admin/latih-model" className="btn btn-outline btn-xs sm:btn-sm text-white">
                                                    Latih Sekarang
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card bg-accent text-accent-content shadow-xl">
                                        <div className="card-body p-3 sm:p-4 md:p-6">
                                            <h2 className="card-title text-sm sm:text-base md:text-lg">Kelola Dataset</h2>
                                            <p className="text-xs sm:text-sm">Lihat, edit, atau hapus semua data pertanyaan</p>
                                            <div className="card-actions justify-end mt-2">
                                                <a href="/admin/input-pertanyaan?tab=dataset" className="btn btn-outline btn-xs sm:btn-sm text-white">
                                                    Kelola Data
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Refresh Button */}
                                <div className="flex justify-center mt-4 md:mt-8">
                                    <button onClick={fetchDashboardData} className="btn btn-outline btn-xs sm:btn-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Refresh
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <SidebarAdmin />
            </div>
        </>
    );
};

export default AdminPage;