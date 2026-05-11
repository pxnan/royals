import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SidebarAdmin from '../../components/SidebarAdmin';
import ManageDataset from '../../components/ManageDataset';
import ManageUnknownQuestions from '../../components/ManageUnknownQuestions';
import TambahPertanyaan from '../../components/TambahPertanyaan';
import NavbarAdmin from '../../components/NavbarAdmin';

const KelolaData = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Ambil tab dari URL parameter
    const getTabFromUrl = () => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab && ['dataset', 'unknown', 'add'].includes(tab)) {
            return tab;
        }
        return 'dataset'; // default tab
    };

    const [activeTab, setActiveTab] = useState(getTabFromUrl());

    // Update URL ketika tab berubah
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(`/admin/kelola-data?tab=${tab}`, { replace: true });
    };

    // Update state ketika URL berubah (misal dari link eksternal)
    useEffect(() => {
        const tabFromUrl = getTabFromUrl();
        if (tabFromUrl !== activeTab) {
            setActiveTab(tabFromUrl);
        }
    }, [location.search]);

    const handleDataChange = () => {
        // Refresh data setelah ada perubahan
        window.location.reload();
    };

    return (
        <>
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <NavbarAdmin title="Manajemen Data Pertanyaan" />
                    
                    {/* Page content here */}
                    <div className="min-h-screen bg-base-200">
                        <div className="drawer-content flex flex-col md:pr-60 md:pl-60">
                            <div className="p-4 md:p-6">
                                {/* Tab Navigation */}
                                <div className="tabs tabs-boxed mb-8 justify-center">
                                    <button 
                                        className={`tab ${activeTab === 'dataset' ? 'tab-active' : ''}`}
                                        onClick={() => handleTabChange('dataset')}
                                    >
                                        📋 Kelola Dataset
                                    </button>
                                    <button 
                                        className={`tab ${activeTab === 'unknown' ? 'tab-active' : ''}`}
                                        onClick={() => handleTabChange('unknown')}
                                    >
                                        ❓ Pertanyaan Tidak Dikenali
                                    </button>
                                    <button 
                                        className={`tab ${activeTab === 'add' ? 'tab-active' : ''}`}
                                        onClick={() => handleTabChange('add')}
                                    >
                                        ➕ Tambah Pertanyaan Baru
                                    </button>
                                </div>

                                {/* Konten berdasarkan tab yang dipilih */}
                                {activeTab === 'dataset' && (
                                    <div className="mb-10">
                                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 mt-5">
                                            Kelola Dataset Pertanyaan
                                        </h2>
                                        <p className="text-center text-gray-600 text-sm md:text-base mb-8">
                                            Edit, hapus, atau salin data pertanyaan dan jawaban yang sudah ada
                                        </p>
                                        <ManageDataset 
                                            onDataChange={handleDataChange}
                                        />
                                    </div>
                                )}

                                {activeTab === 'unknown' && (
                                    <div className="mb-10">
                                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 mt-5">
                                            Pertanyaan Tidak Dikenali
                                        </h2>
                                        <p className="text-center text-gray-600 text-sm md:text-base mb-8">
                                            Daftar pertanyaan yang tidak dapat dijawab oleh chatbot. Salin atau hapus sesuai kebutuhan.
                                        </p>
                                        <ManageUnknownQuestions 
                                            onDataChange={handleDataChange}
                                        />
                                    </div>
                                )}

                                {activeTab === 'add' && (
                                    <div className="mb-10">
                                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 mt-5">
                                            Tambah Data Pertanyaan Baru
                                        </h2>
                                        <p className="text-center text-gray-600 text-sm md:text-base mb-8">
                                            Tambahkan pertanyaan, jawaban, dan kategori baru ke dataset
                                        </p>
                                        <TambahPertanyaan 
                                            onSuccess={(data) => {
                                                console.log('Data added:', data);
                                                setTimeout(() => {
                                                    window.location.reload();
                                                }, 2000);
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <SidebarAdmin />
            </div>
        </>
    );
}

export default InputPertanyaan;