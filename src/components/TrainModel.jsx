import React, { useState, useEffect } from 'react';
import { trainModel, getModelInfo } from '../api';

// Skeleton Components
const ModelInfoSkeleton = () => (
    <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
            <div className="flex items-center gap-2 mb-4">
                <div className="skeleton h-7 w-56"></div>
                <div className="skeleton h-5 w-16"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="skeleton h-4 w-28 mb-2"></div>
                    <div className="skeleton h-8 w-16 mb-1"></div>
                    <div className="skeleton h-3 w-32"></div>
                </div>
                <div className="stat bg-base-200 rounded-lg p-4">
                    <div className="skeleton h-4 w-28 mb-2"></div>
                    <div className="skeleton h-8 w-16 mb-1"></div>
                    <div className="skeleton h-3 w-32"></div>
                </div>
            </div>
            <div className="mt-4">
                <div className="skeleton h-5 w-36 mb-2"></div>
                <div className="flex flex-wrap gap-2">
                    <div className="skeleton h-6 w-20"></div>
                    <div className="skeleton h-6 w-24"></div>
                    <div className="skeleton h-6 w-16"></div>
                    <div className="skeleton h-6 w-28"></div>
                </div>
            </div>
        </div>
    </div>
);

const TrainModel = () => {
    const [training, setTraining] = useState(false);
    const [trainingResult, setTrainingResult] = useState(null);
    const [modelInfo, setModelInfo] = useState(null);
    const [modelInfoLoading, setModelInfoLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        fetchModelInfo();
    }, []);

    const fetchModelInfo = async () => {
        setModelInfoLoading(true);
        try {
            const data = await getModelInfo();
            setModelInfo(data);
        } catch (err) {
            setError('Gagal mengambil info model');
            console.error('Error:', err);
        } finally {
            setModelInfoLoading(false);
        }
    };

    const handleTrainModel = async () => {
        setTraining(true);
        setError('');
        setTrainingResult(null);
        setStatusMessage('Memulai proses training...');

        try {
            setStatusMessage('Memuat dataset dari database dan melakukan preprocessing...');
            const data = await trainModel();

            setStatusMessage('Training selesai! Menyimpan model...');
            await new Promise(resolve => setTimeout(resolve, 500));

            setTrainingResult(data);
            await fetchModelInfo();
            setStatusMessage('Model berhasil diperbarui!');
        } catch (err) {
            setError(err.message || 'Gagal melatih model');
            setStatusMessage('');
        } finally {
            setTraining(false);
            setTimeout(() => {
                if (statusMessage === 'Model berhasil diperbarui!') setStatusMessage('');
            }, 3000);
        }
    };

    return (
        <div className="space-y-6">
            {/* Informasi Model Saat Ini - Loading terpisah */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="card-title text-2xl">
                            Informasi Model Saat Ini
                        </h2>
                        {!modelInfoLoading && <div className="badge badge-success ml-2">Active</div>}
                        {modelInfoLoading && <div className="skeleton h-5 w-16"></div>}
                    </div>

                    {modelInfoLoading ? (
                        <ModelInfoSkeleton />
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="stat bg-base-200 rounded-lg p-4">
                                    <div className="stat-title">Total Pertanyaan</div>
                                    <div className="stat-value text-primary text-3xl">{modelInfo?.total_questions || 0}</div>
                                    <div className="stat-desc">Data yang sudah dilatih</div>
                                </div>
                                <div className="stat bg-base-200 rounded-lg p-4">
                                    <div className="stat-title">Total Kategori</div>
                                    <div className="stat-value text-secondary text-3xl">{modelInfo?.categories?.length || 0}</div>
                                    <div className="stat-desc">Kategori unik</div>
                                </div>
                            </div>

                            {modelInfo?.categories && modelInfo.categories.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="font-semibold mb-2">Daftar Kategori:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {modelInfo.categories.slice(0, 10).map((cat, idx) => (
                                            <span key={idx} className="badge badge-outline badge-lg">
                                                {cat}
                                            </span>
                                        ))}
                                        {modelInfo.categories.length > 10 && (
                                            <span className="badge badge-outline badge-lg">
                                                +{modelInfo.categories.length - 10} lainnya
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Tombol Training - Selalu tampil tanpa loading */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl mb-4">Latih Ulang Model</h2>

                    <p className="text-gray-600 mb-4">
                        Latih ulang model chatbot dengan data terbaru dari database. 
                        Proses ini akan membaca semua pertanyaan dan jawaban dari tabel <code className="mx-1 px-2 py-0.5 bg-base-200 rounded">dataset</code> 
                        dan memperbarui model AI chatbot.
                    </p>

                    <div className="alert alert-info shadow-lg mb-4">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>
                                Pastikan Anda sudah menambahkan semua data baru sebelum melakukan training.
                                Training akan memakan waktu tergantung jumlah data. Harap tunggu hingga selesai.
                            </span>
                        </div>
                    </div>

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

                    {trainingResult && (
                        <div className="alert alert-success shadow-lg mb-4">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="font-semibold">{trainingResult.message}</p>
                                    <p className="text-sm">Waktu training: {trainingResult.training_time}</p>
                                    <p className="text-sm">Total data: {trainingResult.total_data} pertanyaan</p>
                                    <p className="text-sm">Kategori: {trainingResult.categories_count} kategori</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Indikator Training dengan Spinner */}
                    {training && (
                        <div className="mb-6 text-center">
                            <div className="flex flex-col items-center gap-3">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                                <p className="text-base font-medium text-gray-700">{statusMessage}</p>
                                <p className="text-sm text-gray-500">Jangan tutup halaman ini, proses training sedang berjalan...</p>
                            </div>
                        </div>
                    )}

                    <div className="card-actions justify-end">
                        <button
                            className={`btn btn-primary ${training ? 'loading' : ''}`}
                            onClick={handleTrainModel}
                            disabled={training}
                        >
                            {training ? 'Melatih Model...' : 'Latih Model Sekarang'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Panduan - Selalu tampil tanpa loading */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-xl">Panduan</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>Data latih diambil dari database (tabel <code className="px-1 bg-base-200 rounded">dataset</code>).</li>
                        <li>Training akan memproses semua data dan menyimpan model ke Supabase Storage.</li>
                        <li>Setelah training selesai, chatbot akan langsung menggunakan model terbaru.</li>
                        <li>Waktu training tergantung jumlah data (biasanya 5-30 detik).</li>
                        <li>Jika training memakan waktu lama, harap bersabar dan jangan refresh halaman.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TrainModel;