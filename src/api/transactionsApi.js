import { apiFetch } from "./apiFetch";


// ========================================
// OBTENER TODOS LOS MOVIMIENTOS
// ========================================

export async function getTransactions() {

  try {

    return await apiFetch(
      "/transactions"
    );

  } catch (error) {

    console.error(
      "Error en getTransactions:",
      error.message
    );

    throw error;

  }

}



// ========================================
// OBTENER MOVIMIENTO POR ID
// ========================================

export async function getTransactionById(id) {

  try {

    return await apiFetch(
      `/transactions/${id}`
    );

  } catch (error) {

    console.error(
      "Error en getTransactionById:",
      error.message
    );

    throw error;

  }

}



// ========================================
// CREAR MOVIMIENTO
// ========================================

export async function createTransaction(
  transaction
) {

  try {

    const formData = new FormData();


    formData.append(
      "tipo",
      transaction.tipo
    );


    formData.append(
      "descripcion",
      transaction.descripcion
    );


    formData.append(
      "monto",
      transaction.monto
    );


    formData.append(
      "fecha",
      transaction.fecha
    );


    formData.append(
      "categoria",
      transaction.categoria
    );


    formData.append(
      "cuenta_id",
      transaction.cuenta_id
    );


    // Imagen opcional

    if (transaction.imagen) {

      formData.append(
        "imagen",
        transaction.imagen
      );

    }


    return await apiFetch(
      "/transactions",
      {
        method: "POST",
        body: formData
      }
    );

  } catch (error) {

    console.error(
      "Error en createTransaction:",
      error.message
    );

    throw error;

  }

}



// ========================================
// EDITAR MOVIMIENTO
// ========================================

export async function updateTransaction(
  id,
  transaction
) {

  try {

    const formData = new FormData();


    formData.append(
      "tipo",
      transaction.tipo
    );


    formData.append(
      "descripcion",
      transaction.descripcion
    );


    formData.append(
      "monto",
      transaction.monto
    );


    formData.append(
      "fecha",
      transaction.fecha
    );


    formData.append(
      "categoria",
      transaction.categoria
    );


    formData.append(
      "cuenta_id",
      transaction.cuenta_id
    );


    // ========================================
    // ELIMINAR COMPROBANTE
    // ========================================

    formData.append(
      "eliminar_imagen",
      transaction.eliminar_imagen
        ? "true"
        : "false"
    );


    // ========================================
    // NUEVO COMPROBANTE
    // ========================================

    if (transaction.imagen) {

      formData.append(
        "imagen",
        transaction.imagen
      );

    }


    return await apiFetch(
      `/transactions/${id}`,
      {
        method: "PUT",
        body: formData
      }
    );

  } catch (error) {

    console.error(
      "Error en updateTransaction:",
      error.message
    );

    throw error;

  }

}



// ========================================
// ACTIVAR / DESACTIVAR
// ========================================

export async function toggleTransactionStatus(
  id,
  activo
) {

  try {

    return await apiFetch(
      `/transactions/${id}/status`,
      {
        method: "PATCH",

        body: JSON.stringify({
          activo: !activo
        })
      }
    );

  } catch (error) {

    console.error(
      "Error en toggleTransactionStatus:",
      error.message
    );

    throw error;

  }

}



// ========================================
// ELIMINAR MOVIMIENTO
// ========================================

export async function deleteTransaction(id) {

  try {

    return await apiFetch(
      `/transactions/${id}`,
      {
        method: "DELETE"
      }
    );

  } catch (error) {

    console.error(
      "Error en deleteTransaction:",
      error.message
    );

    throw error;

  }

}



// ========================================
// OBTENER URL DEL COMPROBANTE
// ========================================

export async function getTransactionImage(id) {

  try {

    const data = await apiFetch(
      `/transactions/${id}/image`
    );

    return data.url;

  } catch (error) {

    console.error(
      "Error en getTransactionImage:",
      error.message
    );

    throw error;

  }

}