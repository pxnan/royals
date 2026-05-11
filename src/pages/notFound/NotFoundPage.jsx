import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Kembali ke halaman sebelumnya
    };

    return (
        <div className="w-full h-screen flex justify-center items-center flex-col bg-white text-black gap-3">
            <h1 className="text-7xl text-amber-500 font-bold">404</h1>
            <p className="font-bold text-4xl">Page Not Found</p>
            <p className="text-gray-500 text-lg">Halaman yang Anda cari tidak ditemukan</p>
            <div className="flex gap-3 mt-2">
                <button 
                    onClick={handleGoBack}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md transition-colors cursor-pointer"
                >
                    ← Kembali ke Halaman Sebelumnya
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;