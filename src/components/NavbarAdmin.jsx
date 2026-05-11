import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NavbarAdmin = ({ title }) => {
    const navigate = useNavigate();
    const apiBaseURL = "http://127.0.0.1:5000";
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        const token = localStorage.getItem('admin_token');
        
        if (token) {
            try {
                await fetch(`${apiBaseURL}/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            } catch (err) {
                console.error('Logout error:', err);
            }
        }
        
        // Hapus semua data dari localStorage
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
        localStorage.removeItem('token_expires');
        
        // Redirect ke halaman login
        navigate('/login');
    };

    // Fungsi untuk scroll ke top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Mengecek posisi scroll untuk menampilkan/sembunyikan tombol
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        // Cleanup event listener
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <nav className="navbar w-full bg-base-300 flex justify-between sticky top-0 z-50 shadow-md transition-all duration-300">
                <div className='flex items-center'>
                    <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="size-5">
                            <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                            <path d="M9 4v16"></path>
                            <path d="M14 10l2 2l-2 2"></path>
                        </svg>
                    </label>
                    <div className="px-4 font-semibold">{title}</div>
                </div>
                <button 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className='cursor-pointer text-red-700 py-1 px-2 rounded-md hover:bg-base-200 hover:shadow-md transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {isLoggingOut ? (
                        <>
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Logout...</span>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Logout</span>
                        </>
                    )}
                </button>
            </nav>

            {/* Tombol Scroll to Top */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 
                             bg-primary text-white rounded-full p-3 md:p-4 
                             shadow-lg hover:shadow-xl transition-all duration-300 
                             animate-bounce hover:animate-none
                             focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Scroll to top"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 md:h-6 md:w-6" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M5 10l7-7m0 0l7 7m-7-7v18" 
                        />
                    </svg>
                </button>
            )}

            {/* Style tambahan untuk animasi */}
            <style>{`
                @keyframes bounce {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                .animate-bounce {
                    animation: bounce 2s infinite;
                }
                .hover\\:animate-none:hover {
                    animation: none;
                }
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </>
    );
};

export default NavbarAdmin;