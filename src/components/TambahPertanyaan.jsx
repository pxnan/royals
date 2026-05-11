import React, { useState, useEffect } from 'react';
import { tambahData, getKategori } from '../api';

const TambahPertanyaan = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        pertanyaan: '',
        jawaban: '',
        kategori: ''
    });
    const [kategoriList, setKategoriList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingKategori, setLoadingKategori] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [newKategori, setNewKategori] = useState('');
    const [showNewKategori, setShowNewKategori] = useState(false);

    // Ambil daftar kategori dari API
    useEffect(() => {
        fetchKategori();
    }, []);

    const fetchKategori = async () => {
        setLoadingKategori(true);
        try {
            const data = await getKategori();
            if (data.kategori) {
                setKategoriList(data.kategori);
                console.log('Kategori loaded:', data.kategori);
            } else {
                console.warn('No categories received from API');
            }
        } catch (err) {
            console.error('Gagal mengambil kategori:', err);
            setError('Gagal memuat daftar kategori');
        } finally {
            setLoadingKategori(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
        if (success) setSuccess('');
    };

    const handleKategoriChange = (e) => {
        const value = e.target.value;
        if (value === 'new') {
            setShowNewKategori(true);
            setFormData(prev => ({ ...prev, kategori: '' }));
        } else {
            setShowNewKategori(false);
            setFormData(prev => ({ ...prev, kategori: value }));
        }
    };

    const handleNewKategoriChange = (e) => {
        const value = e.target.value;
        setNewKategori(value);
        setFormData(prev => ({ ...prev, kategori: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.pertanyaan.trim()) {
            setError('Pertanyaan tidak boleh kosong');
            return;
        }
        if (!formData.jawaban.trim()) {
            setError('Jawaban tidak boleh kosong');
            return;
        }
        if (!formData.kategori.trim()) {
            setError('Kategori tidak boleh kosong');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const data = await tambahData(formData);
            setSuccess(data.message || 'Data berhasil ditambahkan!');
            
            // Reset form
            setFormData({
                pertanyaan: '',
                jawaban: '',
                kategori: ''
            });
            setNewKategori('');
            setShowNewKategori(false);
            
            // Refresh kategori list setelah menambah data
            await fetchKategori();
            
            if (onSuccess) onSuccess(data);
            
            // Optional: redirect setelah 2 detik (jika diperlukan)
            // setTimeout(() => {
            //     window.location.reload();
            // }, 2000);
        } catch (err) {
            setError(err.message || 'Gagal menambahkan data');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Tambah Data Pertanyaan Baru</h2>
                
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

                <form onSubmit={handleSubmit}>
                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text font-semibold">Pertanyaan *</span>
                        </label>
                        <textarea
                            name="pertanyaan"
                            value={formData.pertanyaan}
                            onChange={handleChange}
                            className="textarea textarea-bordered h-24"
                            placeholder="Masukkan pertanyaan baru..."
                            disabled={loading}
                        />
                    </div>

                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text font-semibold">Jawaban *</span>
                        </label>
                        <textarea
                            name="jawaban"
                            value={formData.jawaban}
                            onChange={handleChange}
                            className="textarea textarea-bordered h-32"
                            placeholder="Masukkan jawaban untuk pertanyaan tersebut..."
                            disabled={loading}
                        />
                    </div>

                    <div className="form-control mb-4">
                        <label className="label">
                            <span className="label-text font-semibold">Kategori *</span>
                        </label>
                        {loadingKategori ? (
                            <div className="skeleton h-12 w-full"></div>
                        ) : (
                            <select
                                className="select select-bordered w-full"
                                onChange={handleKategoriChange}
                                value={showNewKategori ? 'new' : formData.kategori}
                                disabled={loading}
                            >
                                <option value="">Pilih Kategori</option>
                                {kategoriList.map(kat => (
                                    <option key={kat} value={kat}>{kat}</option>
                                ))}
                                <option value="new">+ Tambah Kategori Baru</option>
                            </select>
                        )}
                        {kategoriList.length === 0 && !loadingKategori && (
                            <p className="text-xs text-warning mt-1">
                                Belum ada kategori. Silakan tambah kategori baru terlebih dahulu.
                            </p>
                        )}
                    </div>

                    {showNewKategori && (
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text font-semibold">Kategori Baru *</span>
                            </label>
                            <input
                                type="text"
                                value={newKategori}
                                onChange={handleNewKategoriChange}
                                className="input input-bordered"
                                placeholder="Masukkan nama kategori baru"
                                disabled={loading}
                            />
                        </div>
                    )}

                    <div className="card-actions justify-end mt-6 gap-3">
                        {onCancel && (
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                Batal
                            </button>
                        )}
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner"></span>
                                    Menyimpan...
                                </>
                            ) : (
                                'Simpan Data'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TambahPertanyaan;