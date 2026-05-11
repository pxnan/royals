import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onClearHistory, hasMessages }) => {
    const [showConfirm, setShowConfirm] = React.useState(false);

    const handleClearClick = () => {
        setShowConfirm(true);
        setTimeout(() => {
            setShowConfirm(false);
        }, 3000);
    };

    const confirmClear = () => {
        if (onClearHistory) {
            onClearHistory();
        }
        setShowConfirm(false);
    };

    const cancelClear = () => {
        setShowConfirm(false);
    };

    return (
        <>
            <div className="navbar bg-white shadow-lg sticky top-0 z-50 border-b border-gray-300">
                <div className="flex w-full justify-between px-5 items-center">
                    <Link to={"/"} className="text-xl font-semibold">
                        Royal's Resto <span className='bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 bg-clip-text text-transparent font-bold'>Bot</span>
                    </Link>
                    
                    {hasMessages && (
                        <button
                            onClick={handleClearClick}
                            className="flex items-center cursor-pointer gap-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
                            title="Hapus semua histori chat"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span className="hidden sm:inline">Hapus Histori</span>
                        </button>
                    )}
                </div>
            </div>

            {showConfirm && (
                <div className="fixed top-16 left-0 right-0 z-50 flex justify-center pointer-events-none">
                    <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-sm mx-4 pointer-events-auto animate-slideDown">
                        <div className="p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    <div className="bg-red-100 rounded-full p-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800">Hapus Histori Chat?</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Riwayat percakapan akan dihapus permanen.
                                    </p>
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={confirmClear}
                                            className="px-3 py-1.5 text-sm cursor-pointer bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                                        >
                                            Ya, Hapus
                                        </button>
                                        <button
                                            onClick={cancelClear}
                                            className="px-3 py-1.5 text-sm cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors duration-200"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Ganti <style jsx> dengan <style> biasa */}
            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }
            `}</style>
        </>
    );
};

export default Navbar;