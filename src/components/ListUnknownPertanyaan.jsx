import React, { useState, useEffect } from 'react';

const ListUnknownPertanyaan = ({ apiURL }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalData, setTotalData] = useState(0);

    const fetchData = async (page = 1) => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${apiURL}?page=${page}`);
            const result = await response.json();
            if (response.ok) {
                setData(result.data);
                setCurrentPage(result.page);
                setTotalPages(result.total_pages);
                setTotalData(result.total_data);
            } else {
                setError(result.error || 'Gagal mengambil data');
            }
        } catch (err) {
            setError('Terjadi kesalahan jaringan');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage, apiURL]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error shadow-lg">
                <div>
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            {data.length === 0 ? (
                <div className="alert alert-info shadow-lg">
                    <div>
                        <span>Tidak ada pertanyaan yang tidak dikenali.</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Pertanyaan</th>
                                    <th>Tanggal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.pertanyaan}</td>
                                        <td>{new Date(item.created_at).toLocaleString('id-ID')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <button
                            className="btn btn-sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            « Sebelumnya
                        </button>
                        <span className="text-sm">
                            Halaman {currentPage} dari {totalPages} (Total: {totalData} data)
                        </span>
                        <button
                            className="btn btn-sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Selanjutnya »
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ListUnknownPertanyaan;