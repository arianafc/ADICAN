const API = import.meta.env.VITE_API_URL;

export async function apiFetch(endpoint, options = {}) {

    const token = localStorage.getItem("token");

    const headers = {
        ...options.headers
    };

    // Agregar Content-Type solamente si NO es FormData
    if (!(options.body instanceof FormData)) {

        headers["Content-Type"] =
            headers["Content-Type"] ||
            "application/json";

    }

    // Agregar token
    if (token) {

        headers.Authorization =
            `Bearer ${token}`;

    }

    const response = await fetch(
        `${API}${endpoint}`,
        {
            ...options,
            headers
        }
    );

    const data = await response.json();

    // Token inválido o expirado
    if (response.status === 401) {

        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        window.location.href = "/";

        throw new Error(
            data.message ||
            "Sesión expirada"
        );

    }

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Error en la solicitud"
        );

    }

    return data;

}