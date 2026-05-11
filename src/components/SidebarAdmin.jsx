import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SidebarAdmin = () => {
    const location = useLocation();

    // Fungsi untuk menutup drawer (khusus mobile)
    const closeDrawer = () => {
        const drawerCheckbox = document.getElementById('my-drawer-4');
        if (drawerCheckbox) {
            drawerCheckbox.checked = false;
        }
    };

    // Helper untuk mengecek apakah menu aktif
    const isActive = (path, tab = null) => {
        if (tab) {
            return location.pathname === path && location.search === `?tab=${tab}`;
        }
        return location.pathname === path;
    };

    // Helper untuk mendapatkan class menu aktif
    const getLinkClass = (isActive) => {
        return `flex items-center gap-2 ${isActive ? 'active' : ''}`;
    };

    return (
        <div className="drawer-side is-drawer-close:overflow-visible pt-16 md:pt-0">
            <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64 shadow-xl relative z-10">
                {/* Logo Section */}
                <div className="w-full border-b border-base-300">
                    <div className="flex items-center justify-center py-4 px-2 is-drawer-close:px-0">
                        <Link to="/admin" onClick={closeDrawer}>
                            <img 
                                src="/logo.png" 
                                alt="Logo" 
                                className="h-10 w-auto object-contain"
                            />
                        </Link>
                    </div>
                </div>

                <ul className="menu w-full grow">
                    {/* Dashboard */}
                    <li>
                        <Link 
                            to={"/admin"} 
                            onClick={closeDrawer}
                            className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${getLinkClass(isActive('/admin'))}`}
                            data-tip="Dashboard"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4">
                                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                                <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            </svg>
                            <span className="is-drawer-close:hidden">Dashboard</span>
                        </Link>
                    </li>
                    
                    {/* Kelola Dataset */}
                    <li>
                        <Link 
                            to={"/admin/input-pertanyaan?tab=dataset"} 
                            onClick={closeDrawer}
                            className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${getLinkClass('/admin/input-pertanyaan', 'dataset')}`}
                            data-tip="Kelola Dataset"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4">
                                <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                            </svg>
                            <span className="is-drawer-close:hidden">Kelola Dataset</span>
                        </Link>
                    </li>

                    {/* Pertanyaan Tidak Dikenali */}
                    <li>
                        <Link 
                            to={"/admin/input-pertanyaan?tab=unknown"} 
                            onClick={closeDrawer}
                            className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${getLinkClass('/admin/input-pertanyaan', 'unknown')}`}
                            data-tip="Pertanyaan Tidak Dikenali"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4">
                                <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span className="is-drawer-close:hidden">Pertanyaan Tidak Dikenali</span>
                        </Link>
                    </li>

                    {/* Tambah Pertanyaan Baru */}
                    <li>
                        <Link 
                            to={"/admin/input-pertanyaan?tab=add"} 
                            onClick={closeDrawer}
                            className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${getLinkClass('/admin/input-pertanyaan', 'add')}`}
                            data-tip="Tambah Pertanyaan"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4">
                                <path d="M12 5v14M5 12h14"></path>
                            </svg>
                            <span className="is-drawer-close:hidden">Tambah Pertanyaan</span>
                        </Link>
                    </li>

                    {/* Latih Model */}
                    <li>
                        <Link 
                            to={"/admin/latih-model"} 
                            onClick={closeDrawer}
                            className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${getLinkClass('/admin/latih-model')}`}
                            data-tip="Latih Model"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                <path d="M8 7h8"></path>
                                <path d="M8 11h6"></path>
                                <path d="M8 15h4"></path>
                            </svg>
                            <span className="is-drawer-close:hidden">Latih Model</span>
                        </Link>
                    </li>

                    {/* Kelola Admin */}
                    <li>
                        <Link 
                            to={"/admin/kelola-admin"} 
                            onClick={closeDrawer}
                            className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${getLinkClass('/admin/kelola-admin')}`}
                            data-tip="Kelola Admin"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span className="is-drawer-close:hidden">Kelola Admin</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default SidebarAdmin;