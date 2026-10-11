import { apiFetch } from "./apiFetch";

// ========================================
// OBTENER USUARIOS
// ========================================

export async function getUsers() {

    try {

        return await apiFetch("/users");

    } catch (error) {

        console.error(
            "Error en getUsers:",
            error.message
        );

        throw error;

    }

}


// ========================================
// CREAR USUARIO
// ========================================

export async function createUser(user) {

    try {

        return await apiFetch(
            "/users",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(user)
            }
        );

    } catch (error) {

        console.error(
            "Error en createUser:",
            error.message
        );

        throw error;

    }

}


// ========================================
// EDITAR USUARIO
// ========================================

export async function updateUser(
    id,
    user
) {

    try {

        return await apiFetch(
            `/users/${id}`,
            {
                method: "PUT",

                body: JSON.stringify(user)
            }
        );

    } catch (error) {

        console.error(
            "Error en updateUser:",
            error.message
        );

        throw error;

    }

}


// ========================================
// ACTIVAR / DESACTIVAR
// ========================================

export async function toggleUserStatus(
    id,
    activo
) {

    try {

        return await apiFetch(
            `/users/${id}/status`,
            {
                method: "PATCH",

                body: JSON.stringify({
                    activo: !activo
                })
            }
        );

    } catch (error) {

        console.error(
            "Error en toggleUserStatus:",
            error.message
        );

        throw error;

    }

}


// ========================================
// ELIMINAR USUARIO
// ========================================

export async function deleteUser(id) {

    try {

        return await apiFetch(
            `/users/${id}`,
            {
                method: "DELETE"
            }
        );

    } catch (error) {

        console.error(
            "Error en deleteUser:",
            error.message
        );

        throw error;

    }

}