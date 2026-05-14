import React, { useState, useEffect } from 'react';
import { getUnknownQuestions, deleteUnknownQuestion, deleteAllUnknownQuestions } from '../api';

// Skeleton Components
const HeaderSkeleton = () => (
  <div className="card bg-base-100 shadow-xl mb-6">
    <div className="card-body">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="skeleton h-7 w-48"></div>
            <div className="skeleton h-5 w-16"></div>
          </div>
          <div className="skeleton h-4 w-64 mt-2"></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="skeleton h-8 w-36"></div>
          <div className="skeleton h-8 w-28"></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="skeleton h-8 w-36"></div>
          <div className="skeleton h-8 w-28"></div>
        </div>
      </div>
    </div>
  </div>
);

const TableSkeleton = ({ rows = 10, columns = 5 }) => (
  <div className="overflow-x-auto">
    <table className="table w-full">
      <thead>
        <tr className="bg-base-200">
          {[...Array(columns)].map((_, i) => (
            <th key={i}><div className="skeleton h-4 w-12"></div></th>
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

const ManageUnknownQuestions = ({ onDataChange }) => {
    const [data, setData] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalData, setTotalData] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [showDeleteSelectedModal, setShowDeleteSelectedModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const fetchData = async (page = 1) => {
        setDataLoading(true);
        setError('');
        try {
            const result = await getUnknownQuestions(page, 10);
            setData(result.data);
            setCurrentPage(result.page);
            setTotalPages(result.total_pages);
            setTotalData(result.total_data);
        } catch (err) {
            setError(err.message || 'Gagal mengambil data');
            console.error('Error:', err);
        } finally {
            setDataLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setSuccessMessage('Pertanyaan berhasil disalin!');
        setTimeout(() => setSuccessMessage(''), 2000);
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteUnknownQuestion(deleteId);
            setSuccessMessage('Pertanyaan berhasil dihapus!');
            setTimeout(() => setSuccessMessage(''), 3000);
            setShowDeleteModal(false);
            setDeleteId(null);
            fetchData(currentPage);
            if (onDataChange) onDataChange();
        } catch (err) {
            setError(err.message || 'Gagal menghapus data');
        }
    };

    const handleDeleteAll = async () => {
        try {
            const result = await deleteAllUnknownQuestions();
            setSuccessMessage(result.message);
            setTimeout(() => setSuccessMessage(''), 3000);
            setShowDeleteAllModal(false);
            fetchData(1);
            if (onDataChange) onDataChange();
        } catch (err) {
            setError(err.message || 'Gagal menghapus semua data');
        }
    };

    const handleDeleteSelectedClick = () => {
        setShowDeleteSelectedModal(true);
    };

    const handleDeleteSelectedConfirm = async () => {
        try {
            for (const id of selectedItems) {
                await deleteUnknownQuestion(id);
            }
            setSuccessMessage(`${selectedItems.length} pertanyaan berhasil dihapus!`);
            setTimeout(() => setSuccessMessage(''), 3000);
            setSelectedItems([]);
            setSelectAll(false);
            setShowDeleteSelectedModal(false);
            fetchData(currentPage);
            if (onDataChange) onDataChange();
        } catch (err) {
            setError(err.message || 'Gagal menghapus data terpilih');
        }
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            setSelectedItems(data.map(item => item.id));
        }
        setSelectAll(!selectAll);
    };

    const handleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const navigateToAddTab = () => {
        window.location.href = '/admin/kelola-data?tab=add';
    };

    const navigateToDatasetTab = () => {
        window.location.href = '/admin/kelola-data?tab=dataset';
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

    const getRowNumber = (index) => {
        return ((currentPage - 1) * 10) + index + 1;
    };

    return (
        <div>
            {/* Success Message */}
            {successMessage && (
                <div className="alert alert-success shadow-lg mb-4 animate-pulse">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{successMessage}</span>
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

            {/* Header Actions - Selalu tampil tanpa loading */}
            <div className="card bg-base-100 shadow-xl mb-6">
                <div className="card-body">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h2 className="card-title text-xl">
                                Pertanyaan Tidak Dikenali
                                {!dataLoading && <div className="badge badge-warning ml-2 h-auto">{totalData} Pertanyaan</div>}
                                {dataLoading && <div className="skeleton h-5 w-16 ml-2"></div>}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Daftar pertanyaan yang tidak dapat dijawab oleh chatbot
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={navigateToAddTab}
                                title="Tambah ke Dataset"
                            >
                                + Tambah ke Dataset
                            </button>
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={navigateToDatasetTab}
                                title="Kelola Dataset"
                            >
                                📋 Kelola Dataset
                            </button>
                            {!dataLoading && selectedItems.length > 0 && (
                                <button
                                    className="btn btn-error btn-sm"
                                    onClick={handleDeleteSelectedClick}
                                    title={`Hapus ${selectedItems.length} terpilih`}
                                >
                                    🗑️ Hapus Terpilih ({selectedItems.length})
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Table - Loading terpisah */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    {dataLoading ? (
                        <>
                            <TableSkeleton rows={10} columns={5} />
                            <PaginationSkeleton />
                            <div className="flex justify-center mt-4">
                                <div className="skeleton h-3 w-48"></div>
                            </div>
                        </>
                    ) : data.length === 0 ? (
                        <div className="alert alert-info shadow-lg">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span>Tidak ada pertanyaan yang tidak dikenali. Semua pertanyaan berhasil dijawab!</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full">
                                    <thead>
                                        <tr className="bg-base-200">
                                            <th className="w-12">
                                                <input
                                                    type="checkbox"
                                                    className="checkbox checkbox-sm"
                                                    checked={selectAll}
                                                    onChange={handleSelectAll}
                                                />
                                            </th>
                                            <th className="w-16 text-center">No</th>
                                            <th className="min-w-[300px]">Pertanyaan</th>
                                            <th className="w-48">Tanggal</th>
                                            <th className="w-24 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-base-200 transition-colors">
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        className="checkbox checkbox-sm"
                                                        checked={selectedItems.includes(item.id)}
                                                        onChange={() => handleSelectItem(item.id)}
                                                    />
                                                </td>
                                                <td className="text-center font-medium">
                                                    {getRowNumber(index)}
                                                </td>
                                                <td className="whitespace-normal break-words">
                                                    <div className="group relative pr-8">
                                                        <span className="text-sm">{item.pertanyaan}</span>
                                                        <button
                                                            onClick={() => handleCopy(item.pertanyaan)}
                                                            className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 btn btn-xs btn-ghost"
                                                            title="Salin pertanyaan"
                                                        >
                                                            📋
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap text-sm">
                                                    {formatDate(item.created_at)}
                                                </td>
                                                <td className="text-center">
                                                    <div className="flex gap-1 justify-center">
                                                        <button
                                                            className="btn btn-xs btn-info"
                                                            onClick={() => handleCopy(item.pertanyaan)}
                                                            title="Salin"
                                                        >
                                                            📋
                                                        </button>
                                                        <button
                                                            className="btn btn-xs btn-error"
                                                            onClick={() => handleDeleteClick(item.id)}
                                                            title="Hapus"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Desktop */}
                            {totalPages > 1 && (
                                <div className="hidden md:flex justify-center items-center gap-4 mt-6">
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

                            {/* Pagination Mobile */}
                            {totalPages > 1 && (
                                <div className="flex md:hidden justify-center items-center gap-4 mt-6">
                                    <button
                                        className="btn btn-sm"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        « Sebelumnya
                                    </button>
                                    <div className="flex gap-1">
                                        <span className="text-sm text-gray-600">
                                            Halaman {currentPage} dari {totalPages}
                                        </span>
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

                            {/* Info */}
                            <div className="text-center text-xs text-gray-500 mt-4">
                                Menampilkan {((currentPage - 1) * 10) + 1} - {Math.min(currentPage * 10, totalData)} dari {totalData} pertanyaan
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Delete Single Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Konfirmasi Hapus</h3>
                        <p className="py-4">Apakah Anda yakin ingin menghapus pertanyaan ini? Tindakan ini tidak dapat dibatalkan.</p>
                        <div className="modal-action">
                            <button className="btn btn-error" onClick={handleDeleteConfirm}>
                                Hapus
                            </button>
                            <button className="btn" onClick={() => setShowDeleteModal(false)}>
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Selected Confirmation Modal */}
            {showDeleteSelectedModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg text-warning">⚠️ Konfirmasi Hapus Terpilih</h3>
                        <p className="py-4">
                            Apakah Anda yakin ingin menghapus <span className="font-bold text-warning">{selectedItems.length}</span> pertanyaan yang dipilih?
                            <br />
                            <br />
                            <span className="text-error font-bold">Tindakan ini tidak dapat dibatalkan!</span>
                        </p>
                        <div className="modal-action">
                            <button className="btn btn-error" onClick={handleDeleteSelectedConfirm}>
                                Ya, Hapus {selectedItems.length} Pertanyaan
                            </button>
                            <button className="btn" onClick={() => setShowDeleteSelectedModal(false)}>
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUnknownQuestions;