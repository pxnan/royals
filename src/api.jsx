// src/api.jsx

// ==================== KONFIGURASI API UNTUK VITE ====================
// Menggunakan import.meta.env dengan fallback untuk menghindari undefined
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";
const API_KEY = import.meta.env.VITE_API_KEY || "RoyalsResto2024SecureKey!@";

// Helper untuk logging hanya di development
const devLog = (...args) => {
    if (import.meta.env.DEV) {
        console.log(...args);
    }
};

// Helper function untuk headers
const getHeaders = (additionalHeaders = {}) => {
    return {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
        ...additionalHeaders
    };
};

// Helper function untuk headers dengan Authorization token
const getAuthHeaders = (token, additionalHeaders = {}) => {
    return {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
        "Authorization": `Bearer ${token}`,
        ...additionalHeaders
    };
};

// ==================== ENDPOINT AUTHENTICATION ====================
export async function login(username, password) {
    devLog("Login attempt with username:", username);
    devLog("API URL:", API_BASE_URL);
    
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ username, password }),
    });

    devLog("Response status:", response.status);

    if (!response.ok) {
        const error = await response.json();
        devLog("Error response:", error);
        throw new Error(error.error || "Login gagal");
    }

    return await response.json();
}

// ==================== ENDPOINT CHATBOT ====================
export async function sendQuestion(question) {
    const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ pertanyaan: question }),
    });

    if (!response.ok) {
        throw new Error("Gagal menghubungi server");
    }

    return await response.json();
}

export async function sendAmbiguousUnknown(question) {
    console.log("Mengirim pertanyaan ke server:", question); // Debugging
    
    const response = await fetch(`${API_BASE_URL}/chat/ambiguous-unknown`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ original_question: question }),
    });

    if (!response.ok) {
        throw new Error("Gagal menghubungi server");
    }

    return await response.json();
}

export async function getRecommendations() {
    const response = await fetch(`${API_BASE_URL}/api/recommendations`, {
        method: "GET",
        headers: getHeaders(),
    });
    if (!response.ok) {
        throw new Error("Gagal mengambil rekomendasi");
    }
    return await response.json();
}

export async function getRecommendationsByCategory(kategori) {
    const response = await fetch(`${API_BASE_URL}/api/recommendations/by-category?kategori=${encodeURIComponent(kategori)}`, {
        method: "GET",
        headers: getHeaders(),
    });
    if (!response.ok) {
        throw new Error("Gagal mengambil rekomendasi berdasarkan kategori");
    }
    return await response.json();
}

// ==================== ENDPOINT UNKNOWN QUESTIONS ====================
export async function getUnknownQuestions(page = 1, perPage = 10) {
    const response = await fetch(`${API_BASE_URL}/pertanyaan-unknown?page=${page}&per_page=${perPage}`, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Gagal mengambil data pertanyaan tidak dikenal");
    }

    return await response.json();
}

export async function deleteUnknownQuestion(id) {
    const response = await fetch(`${API_BASE_URL}/delete-unknown`, {
        method: "DELETE",
        headers: getHeaders(),
        body: JSON.stringify({ id }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal menghapus pertanyaan");
    }

    return await response.json();
}

export async function deleteAllUnknownQuestions() {
    const response = await fetch(`${API_BASE_URL}/delete-all-unknown`, {
        method: "DELETE",
        headers: getHeaders(),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal menghapus semua pertanyaan");
    }

    return await response.json();
}

// ==================== ENDPOINT AUTHENTICATION (sekunder) ====================
export async function logout(token) {
    const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: getAuthHeaders(token),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Logout gagal");
    }

    return await response.json();
}

export async function verifyToken(token) {
    const response = await fetch(`${API_BASE_URL}/verify-token`, {
        method: "GET",
        headers: getAuthHeaders(token),
    });

    if (!response.ok) {
        return { authenticated: false };
    }

    return await response.json();
}

export async function changePassword(token, oldPassword, newPassword, confirmPassword) {
    const response = await fetch(`${API_BASE_URL}/change-password`, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ 
            old_password: oldPassword, 
            new_password: newPassword, 
            confirm_password: confirmPassword 
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal mengubah password");
    }

    return await response.json();
}

export async function getAdminProfile(token) {
    const response = await fetch(`${API_BASE_URL}/admin-profile`, {
        method: "GET",
        headers: getAuthHeaders(token),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal mengambil profil");
    }

    return await response.json();
}

// ==================== ENDPOINT KELOLA ADMIN ====================
export async function getAdmins(token, page = 1, perPage = 10, search = "") {
    let url = `${API_BASE_URL}/api/admins?page=${page}&per_page=${perPage}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    
    const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(token),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal mengambil data admin");
    }

    return await response.json();
}

export async function createAdmin(token, adminData) {
    const response = await fetch(`${API_BASE_URL}/api/admins`, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify(adminData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal membuat admin");
    }

    return await response.json();
}

export async function updateAdmin(token, adminId, adminData) {
    const response = await fetch(`${API_BASE_URL}/api/admins/${adminId}`, {
        method: "PUT",
        headers: getAuthHeaders(token),
        body: JSON.stringify(adminData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal mengupdate admin");
    }

    return await response.json();
}

export async function resetAdminPassword(token, adminId, newPassword) {
    const response = await fetch(`${API_BASE_URL}/api/admins/${adminId}/reset-password`, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ new_password: newPassword }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal reset password");
    }

    return await response.json();
}

export async function deleteAdmin(token, adminId) {
    const response = await fetch(`${API_BASE_URL}/api/admins/${adminId}`, {
        method: "DELETE",
        headers: getAuthHeaders(token),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal menghapus admin");
    }

    return await response.json();
}

// ==================== ENDPOINT DATASET MANAGEMENT ====================
export async function getAllData(page = 1, perPage = 20, search = "", kategori = "") {
    let url = `${API_BASE_URL}/get-all-data?page=${page}&per_page=${perPage}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (kategori) url += `&kategori=${encodeURIComponent(kategori)}`;
    
    const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Gagal mengambil data dataset");
    }

    return await response.json();
}

export async function tambahData(data) {
    const response = await fetch(`${API_BASE_URL}/tambah-data`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal menambahkan data");
    }

    return await response.json();
}

export async function updateData(id, data) {
    const response = await fetch(`${API_BASE_URL}/update-data`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ id, ...data }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal mengupdate data");
    }
    return await response.json();
}

export async function deleteData(id) {
    const response = await fetch(`${API_BASE_URL}/delete-data`, {
        method: "DELETE",
        headers: getHeaders(),
        body: JSON.stringify({ id }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal menghapus data");
    }
    return await response.json();
}

// ==================== ENDPOINT BULK DELETE ====================
export async function deleteBulkData(indices) {
    const response = await fetch(`${API_BASE_URL}/delete-bulk-data`, {
        method: "DELETE",
        headers: getHeaders(),
        body: JSON.stringify({ indices }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal menghapus data terpilih");
    }

    return await response.json();
}

// ==================== ENDPOINT TRAINING MODEL ====================
export async function trainModel() {
    const response = await fetch(`${API_BASE_URL}/train-model`, {
        method: "POST",
        headers: getHeaders(),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal melatih model");
    }

    return await response.json();
}

export async function getModelInfo() {
    const response = await fetch(`${API_BASE_URL}/model-info`, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Gagal mengambil informasi model");
    }

    return await response.json();
}

export async function getKategori() {
    const response = await fetch(`${API_BASE_URL}/kategori`, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Gagal mengambil daftar kategori");
    }

    return await response.json();
}

// ==================== ENDPOINT DEBUG ====================
export async function cekCSV() {
    const response = await fetch(`${API_BASE_URL}/cek-csv`, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Gagal cek CSV");
    }

    return await response.json();
}

export async function fixCSV() {
    const response = await fetch(`${API_BASE_URL}/fix-csv`, {
        method: "POST",
        headers: getHeaders(),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal memperbaiki CSV");
    }

    return await response.json();
}

// ==================== ENDPOINT STATISTIK ====================
export async function getStats() {
    const response = await fetch(`${API_BASE_URL}/api/stats`, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        throw new Error("Gagal mengambil statistik");
    }

    return await response.json();
}

export async function getLoginLogs(token, page = 1, perPage = 20) {
    const response = await fetch(`${API_BASE_URL}/api/login-logs?page=${page}&per_page=${perPage}`, {
        method: "GET",
        headers: getAuthHeaders(token),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal mengambil log login");
    }

    return await response.json();
}

export async function resetDatabase(token) {
    const response = await fetch(`${API_BASE_URL}/api/reset-database`, {
        method: "POST",
        headers: getAuthHeaders(token),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal reset database");
    }

    return await response.json();
}

// ==================== EXPORT DEFAULT ====================
export default {
    sendQuestion,
    sendAmbiguousUnknown,
    login,
    logout,
    verifyToken,
    changePassword,
    getAdminProfile,
    getAdmins,
    createAdmin,
    updateAdmin,
    resetAdminPassword,
    deleteAdmin,
    getUnknownQuestions,
    deleteUnknownQuestion,
    deleteAllUnknownQuestions,
    getAllData,
    tambahData,
    updateData,
    deleteData,
    deleteBulkData,
    trainModel,
    getModelInfo,
    getKategori,
    cekCSV,
    fixCSV,
    getStats,
    getLoginLogs,
    resetDatabase
};