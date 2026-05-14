import React, { useState, useEffect } from "react";
import { getAllData, updateData, deleteData, getKategori } from "../api";

// Skeleton Components
const FilterSkeleton = () => (
  <div className="card bg-base-100 shadow-xl mb-6">
    <div className="card-body">
      <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
        <div className="skeleton h-7 w-24"></div>
        <div className="flex gap-2">
          <div className="skeleton h-8 w-28"></div>
          <div className="skeleton h-8 w-28"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="form-control">
          <div className="skeleton h-4 w-24 mb-1"></div>
          <div className="skeleton h-10 w-full"></div>
        </div>
        <div className="form-control">
          <div className="skeleton h-4 w-24 mb-1"></div>
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

const TableSkeleton = ({ rows = 20, columns = 5 }) => (
  <div className="overflow-x-auto">
    <table className="table w-full">
      <thead>
        <tr>
          {[...Array(columns)].map((_, i) => (
            <th key={i}><div className="skeleton h-4 w-20"></div></th>
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

const ManageDataset = ({ onDataChange }) => {
  const [data, setData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [search, setSearch] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    pertanyaan: "",
    jawaban: "",
    kategori: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchData = async (page = 1, searchTerm = "", kategori = "") => {
    setDataLoading(true);
    setError("");
    try {
      const result = await getAllData(page, 20, searchTerm, kategori);
      setData(result.data);
      setCurrentPage(result.page);
      setTotalPages(result.total_pages);
      setTotalData(result.total_data);
      if (result.categories && result.categories.length > 0) {
        setCategories(result.categories);
      }
    } catch (err) {
      setError(err.message || "Gagal mengambil data");
      console.error("Error:", err);
    } finally {
      setDataLoading(false);
    }
  };

  // Load categories separately (granular)
  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const result = await getKategori();
        if (result.kategori) setCategories(result.kategori);
      } catch (err) {
        console.error("Error loading categories:", err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    fetchData(currentPage, search, kategoriFilter);
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData(1, search, kategoriFilter);
  };

  const handleResetFilter = () => {
    setSearch("");
    setKategoriFilter("");
    setCurrentPage(1);
    fetchData(1, "", "");
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      pertanyaan: item.pertanyaan,
      jawaban: item.jawaban,
      kategori: item.kategori,
    });
  };

  const handleUpdate = async () => {
    if (
      !editForm.pertanyaan.trim() ||
      !editForm.jawaban.trim() ||
      !editForm.kategori.trim()
    ) {
      setError("Semua field harus diisi");
      return;
    }
    try {
      await updateData(editingId, editForm);
      setSuccessMessage("Data berhasil diupdate!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setEditingId(null);
      fetchData(currentPage, search, kategoriFilter);
      if (onDataChange) onDataChange();
    } catch (err) {
      setError(err.message || "Gagal mengupdate data");
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteData(deleteId);
      setSuccessMessage("Data berhasil dihapus!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchData(currentPage, search, kategoriFilter);
      if (onDataChange) onDataChange();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCopyQuestion = (question) => {
    navigator.clipboard.writeText(question);
    setSuccessMessage("Pertanyaan berhasil disalin!");
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const handleCopyAnswer = (answer) => {
    navigator.clipboard.writeText(answer);
    setSuccessMessage("Jawaban berhasil disalin!");
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  const navigateToAddTab = () => {
    window.location.href = "/admin/kelola-data?tab=add";
  };

  const navigateToTrainModel = () => {
    window.location.href = "/admin/latih-model";
  };

  return (
    <div>
      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success shadow-lg mb-4 animate-pulse">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-error shadow-lg mb-4">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Filter Section - Selalu tampil tanpa loading */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
            <h2 className="card-title text-lg">Filter Data</h2>
            <div className="flex gap-2">
              <button
                onClick={navigateToAddTab}
                className="btn btn-sm btn-primary"
              >
                + Tambah Baru
              </button>
              <button
                onClick={navigateToTrainModel}
                className="btn btn-sm btn-outline btn-secondary"
              >
                🤖 Latih Model
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Cari Pertanyaan</span>
              </label>
              <input
                type="text"
                placeholder="Ketik kata kunci..."
                className="input input-bordered"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Filter Kategori</span>
              </label>
              {categoriesLoading ? (
                <div className="skeleton h-10 w-full"></div>
              ) : (
                <select
                  className="select select-bordered"
                  value={kategoriFilter}
                  onChange={(e) => setKategoriFilter(e.target.value)}
                >
                  <option value="">Semua Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="form-control flex flex-row items-end gap-2">
              <button className="btn btn-primary" onClick={handleSearch}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
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
              Kelola Dataset
              {!dataLoading && <div className="badge badge-info ml-2">{totalData} Data</div>}
            </h2>
            {!dataLoading && (
              <div className="text-sm text-gray-500">
                Halaman {currentPage} dari {totalPages}
              </div>
            )}
            {dataLoading && (
              <div className="flex gap-2">
                <div className="skeleton h-5 w-32"></div>
              </div>
            )}
          </div>

          {dataLoading ? (
            <>
              <TableSkeleton rows={20} columns={5} />
              <PaginationSkeleton />
              <div className="flex justify-center mt-4">
                <div className="skeleton h-3 w-48"></div>
              </div>
            </>
          ) : data.length === 0 ? (
            <div className="alert alert-info shadow-lg">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current flex-shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>Tidak ada data ditemukan. Silakan tambah data baru.</span>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr className="bg-base-200">
                      <th className="w-16">No</th>
                      <th className="min-w-[200px]">Pertanyaan</th>
                      <th className="min-w-[300px]">Jawaban</th>
                      <th className="w-32">Kategori</th>
                      <th className="w-28 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, idx) => (
                      <tr
                        key={item.id}
                        className="hover:bg-base-200 transition-colors"
                      >
                        <td className="font-medium">
                          {(currentPage - 1) * 20 + idx + 1}
                        </td>
                        <td className="whitespace-normal break-words max-w-md">
                          {editingId === item.id ? (
                            <textarea
                              className="textarea textarea-bordered w-full text-sm"
                              value={editForm.pertanyaan}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  pertanyaan: e.target.value,
                                })
                              }
                              rows="2"
                            />
                          ) : (
                            <div className="group relative pr-8">
                              <span className="text-sm">{item.pertanyaan}</span>
                              <button
                                onClick={() =>
                                  handleCopyQuestion(item.pertanyaan)
                                }
                                className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 btn btn-xs btn-ghost"
                                title="Salin pertanyaan"
                              >
                                📋
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="whitespace-normal break-words max-w-md">
                          {editingId === item.id ? (
                            <textarea
                              className="textarea textarea-bordered w-full text-sm"
                              value={editForm.jawaban}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  jawaban: e.target.value,
                                })
                              }
                              rows="3"
                            />
                          ) : (
                            <div className="group relative pr-8">
                              <span className="text-sm">{item.jawaban}</span>
                              <button
                                onClick={() => handleCopyAnswer(item.jawaban)}
                                className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 btn btn-xs btn-ghost"
                                title="Salin jawaban"
                              >
                                📋
                              </button>
                            </div>
                          )}
                        </td>
                        <td>
                          {editingId === item.id ? (
                            <input
                              type="text"
                              className="input input-bordered input-sm w-full"
                              value={editForm.kategori}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  kategori: e.target.value,
                                })
                              }
                              list="categories-list"
                            />
                          ) : (
                            <span className="badge badge-outline badge-sm">
                              {item.kategori}
                            </span>
                          )}
                        </td>
                        <td className="text-center">
                          {editingId === item.id ? (
                            <div className="flex gap-1 justify-center">
                              <button
                                className="btn btn-xs btn-success"
                                onClick={handleUpdate}
                                title="Simpan"
                              >
                                💾
                              </button>
                              <button
                                className="btn btn-xs btn-ghost"
                                onClick={() => setEditingId(null)}
                                title="Batal"
                              >
                                ✖
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-1 justify-center">
                              <button
                                className="btn btn-xs btn-info"
                                onClick={() => handleEdit(item)}
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                className="btn btn-xs btn-error"
                                onClick={() => handleDeleteClick(item.id)}
                                title="Hapus"
                              >
                                🗑️
                              </button>
                            </div>
                          )}
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
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
                          className={`btn btn-sm ${currentPage === pageNum ? "btn-primary" : "btn-ghost"}`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    className="btn btn-sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
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
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Selanjutnya »
                  </button>
                </div>
              )}

              {/* Info Halaman */}
              <div className="text-center text-xs text-gray-500 mt-4">
                Menampilkan {(currentPage - 1) * 20 + 1} -{" "}
                {Math.min(currentPage * 20, totalData)} dari {totalData} data
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Konfirmasi Hapus</h3>
            <p className="py-4">
              Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak
              dapat dibatalkan.
            </p>
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

      {/* datalist for categories */}
      <datalist id="categories-list">
        {categories.map((cat) => (
          <option key={cat} value={cat} />
        ))}
      </datalist>
    </div>
  );
};

export default ManageDataset;