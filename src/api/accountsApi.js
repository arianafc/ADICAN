import { apiFetch } from "./apiFetch";

const getToken = () => {
    return localStorage.getItem("token");
};
// ========================================
// OBTENER CUENTAS
// ========================================

export async function getAccounts() {

    try {

        return await apiFetch(
            "/accounts"
        );

    } catch (error) {

        console.error(
            "Error en getAccounts:",
            error.message
        );

        throw error;

    }

}



// ========================================
// CREAR CUENTA
// ========================================

export async function createAccount(account) {

    try {

        return await apiFetch(
            "/accounts",
            {
                method: "POST",

                body: JSON.stringify(account)
            }
        );

    } catch (error) {

        console.error(
            "Error en createAccount:",
            error.message
        );

        throw error;

    }

}



// ========================================
// EDITAR CUENTA
// ========================================

export async function updateAccount(
    id,
    account
) {

    try {

        return await apiFetch(
            `/accounts/${id}`,
            {
                method: "PUT",

                body: JSON.stringify(account)
            }
        );

    } catch (error) {

        console.error(
            "Error en updateAccount:",
            error.message
        );

        throw error;

    }

}



// ========================================
// ACTIVAR / DESACTIVAR
// ========================================

export async function toggleAccountStatus(
    id,
    activo
) {

    try {

        return await apiFetch(
            `/accounts/${id}/status`,
            {
                method: "PATCH",

                body: JSON.stringify({
                    activo: !activo
                })
            }
        );

    } catch (error) {

        console.error(
            "Error en toggleAccountStatus:",
            error.message
        );

        throw error;

    }

}



// ========================================
// ELIMINAR CUENTA
// ========================================

export async function deleteAccount(id) {

    try {

        return await apiFetch(
            `/accounts/${id}`,
            {
                method: "DELETE"
            }
        );

    } catch (error) {

        console.error(
            "ERROR REAL ELIMINANDO CUENTA:",
            error
        );

        console.error(
            "ID DE CUENTA:",
            id
        );

        throw error;

    }

}