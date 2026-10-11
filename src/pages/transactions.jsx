import { useEffect, useState } from "react";

import {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    toggleTransactionStatus,
    getTransactionImage
} from "../api/transactionsApi";

import {
    getAccounts
} from "../api/accountsApi";

const usuario =
    JSON.parse(localStorage.getItem("usuario"));

const esAdmin =
    usuario?.rol?.toLowerCase() === "admin";

// =====================================================
// FORMULARIO VACÍO
// =====================================================

const emptyForm = {
    tipo: "ingreso",
    descripcion: "",
    monto: "",
    fecha: "",
    categoria: "",
    cuenta_id: "",
    imagen: null,
    eliminar_imagen: false
};


// =====================================================
// COMPONENTE
// =====================================================

export default function Transactions() {


    // =================================================
    // RESPONSIVE
    // =================================================

    const [mobile, setMobile] = useState(
        window.innerWidth < 768
    );


    // =================================================
    // DATOS
    // =================================================

    const [transactions, setTransactions] =
        useState([]);

    const [accounts, setAccounts] =
        useState([]);


    // =================================================
    // FORMULARIO
    // =================================================

    const [form, setForm] =
        useState({
            ...emptyForm
        });


    // =================================================
    // ESTADOS
    // =================================================

    const [showForm, setShowForm] =
        useState(false);

    const [editingId, setEditingId] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [imagePreview, setImagePreview] =
        useState(null);

    const [removeImage, setRemoveImage] =
        useState(false);


    // =================================================
    // CARGAR DATOS
    // =================================================

    useEffect(() => {

        loadData();


        const resize = () => {

            setMobile(
                window.innerWidth < 768
            );

        };


        window.addEventListener(
            "resize",
            resize
        );


        return () => {

            window.removeEventListener(
                "resize",
                resize
            );

        };

    }, []);


    // =================================================
    // CARGAR MOVIMIENTOS Y CUENTAS
    // =================================================

    const loadData = async () => {

        try {

            setLoading(true);

            setError("");


            const [
                transactionsData,
                accountsData
            ] = await Promise.all([

                getTransactions(),

                getAccounts()

            ]);


            setTransactions(
                Array.isArray(transactionsData)
                    ? transactionsData
                    : []
            );


            setAccounts(
                Array.isArray(accountsData)
                    ? accountsData
                    : []
            );


        } catch (err) {

            console.error(
                "Error cargando datos:",
                err
            );


            setError(
                err.message ||
                "No se pudieron cargar los datos"
            );


        } finally {

            setLoading(false);

        }

    };


    // =================================================
    // KPIs
    // =================================================

    const activeTransactions =
        transactions.filter(
            t => t.activo !== false
        );


    const totalIncome =
        activeTransactions
            .filter(
                t => t.tipo === "ingreso"
            )
            .reduce(
                (total, t) =>
                    total + Number(t.monto || 0),
                0
            );


    const totalExpense =
        activeTransactions
            .filter(
                t => t.tipo === "egreso"
            )
            .reduce(
                (total, t) =>
                    total + Number(t.monto || 0),
                0
            );


    const netBalance =
        totalIncome -
        totalExpense;


    // =================================================
    // FORMATEAR MONEDA
    // =================================================

    const formatCurrency = (
        value,
        currency = "CRC"
    ) => {

        const number =
            Number(value || 0);


        if (currency === "USD") {

            return `$${number.toLocaleString(
                "en-US",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )}`;

        }


        return `₡${number.toLocaleString(
            "es-CR",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        )}`;

    };


    // =================================================
    // NUEVO MOVIMIENTO
    // =================================================

    const handleNew = () => {

        setEditingId(null);

        setForm({
            ...emptyForm
        });

        setImagePreview(null);

        setRemoveImage(false);

        setError("");

        setSuccess("");

        setShowForm(true);

    };


    // =================================================
    // EDITAR
    // =================================================

    const handleEdit = (transaction) => {

        setEditingId(
            transaction.id
        );


        setForm({

            tipo:
                transaction.tipo ||
                "ingreso",

            descripcion:
                transaction.descripcion ||
                "",

            monto:
                transaction.monto ||
                "",

            fecha:
                transaction.fecha
                    ? transaction.fecha.substring(
                        0,
                        10
                    )
                    : "",

            categoria:
                transaction.categoria ||
                "",

            cuenta_id:
                transaction.cuenta_id ||
                "",

            imagen:
                null,

            eliminar_imagen:
                false

        });


        setImagePreview(null);

        setRemoveImage(false);

        setError("");

        setSuccess("");

        setShowForm(true);

    };


    // =================================================
    // CANCELAR
    // =================================================

    const handleCancel = () => {

        setEditingId(null);

        setForm({
            ...emptyForm
        });

        setImagePreview(null);

        setRemoveImage(false);

        setError("");

        setSuccess("");

        setShowForm(false);

    };


    // =================================================
    // CAMBIAR FORMULARIO
    // =================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setForm(prev => ({

            ...prev,

            [name]: value

        }));

    };


    // =================================================
    // SELECCIONAR IMAGEN
    // =================================================

    const handleImageChange = (e) => {

        const file =
            e.target.files?.[0];


        if (!file) {
            return;
        }


        // =============================================
        // VALIDAR TIPO
        // =============================================

        const allowedTypes = [

            "image/jpeg",

            "image/png",

            "image/webp"

        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            setError(
                "El comprobante debe ser una imagen JPG, PNG o WEBP"
            );

            return;

        }


        // =============================================
        // VALIDAR TAMAÑO
        // =============================================

        if (
            file.size >
            5 * 1024 * 1024
        ) {

            setError(
                "La imagen no puede superar los 5 MB"
            );

            return;

        }


        setForm(prev => ({

            ...prev,

            imagen:
                file,

            eliminar_imagen:
                false

        }));


        setRemoveImage(false);

        setError("");


        setImagePreview(
            URL.createObjectURL(file)
        );

    };


    // =================================================
    // ELIMINAR COMPROBANTE
    // =================================================

    const handleRemoveImage = () => {

        setRemoveImage(true);


        setForm(prev => ({

            ...prev,

            eliminar_imagen:
                true,

            imagen:
                null

        }));


        setImagePreview(null);

    };


    // =================================================
    // CANCELAR ELIMINACIÓN DEL COMPROBANTE
    // =================================================

    const handleUndoRemoveImage = () => {

        setRemoveImage(false);


        setForm(prev => ({

            ...prev,

            eliminar_imagen:
                false

        }));

    };


    // =================================================
    // GUARDAR
    // =================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        try {

            setSaving(true);

            setError("");

            setSuccess("");


            // =========================================
            // VALIDACIONES
            // =========================================

            if (
                !form.tipo ||
                !form.descripcion ||
                !form.monto ||
                !form.fecha ||
                !form.categoria ||
                !form.cuenta_id
            ) {

                setError(
                    "Complete todos los campos requeridos"
                );

                return;

            }


            if (
                Number(form.monto) <= 0
            ) {

                setError(
                    "El monto debe ser mayor a cero"
                );

                return;

            }


            // =========================================
            // CREAR
            // =========================================

            if (!editingId) {

                await createTransaction(
                    form
                );


                setSuccess(
                    "Movimiento creado correctamente"
                );

            }

            // =========================================
            // EDITAR
            // =========================================

            else {

                await updateTransaction(
                    editingId,
                    form
                );


                setSuccess(
                    "Movimiento actualizado correctamente"
                );

            }


            // =========================================
            // RECARGAR
            // =========================================

            await loadData();


            // =========================================
            // LIMPIAR
            // =========================================

            setEditingId(null);

            setForm({
                ...emptyForm
            });

            setImagePreview(null);

            setRemoveImage(false);

            setShowForm(false);


        } catch (err) {

            console.error(
                "Error guardando movimiento:",
                err
            );


            setError(
                err.message ||
                "No se pudo guardar el movimiento"
            );


        } finally {

            setSaving(false);

        }

    };


    // =================================================
    // ELIMINAR
    // =================================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "¿Está seguro de que desea eliminar este movimiento?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setError("");

            setSuccess("");


            await deleteTransaction(
                id
            );


            setSuccess(
                "Movimiento eliminado correctamente"
            );


            await loadData();


        } catch (err) {

            console.error(
                "Error eliminando movimiento:",
                err
            );


            setError(
                err.message ||
                "No se pudo eliminar el movimiento"
            );

        }

    };


    // =================================================
    // ACTIVAR / DESACTIVAR
    // =================================================

  

    // =================================================
    // VER COMPROBANTE
    // =================================================

    const handleViewImage = async (
        id
    ) => {

        try {

            setError("");


            const url =
                await getTransactionImage(
                    id
                );


            window.open(
                url,
                "_blank"
            );


        } catch (err) {

            console.error(
                "Error obteniendo comprobante:",
                err
            );


            setError(
                err.message ||
                "No se pudo obtener el comprobante"
            );

        }

    };


    // =================================================
    // OBTENER NOMBRE DE CUENTA
    // =================================================

    const getAccountName = (
        transaction
    ) => {

        if (
            transaction.cuentas?.nombre
        ) {

            return transaction.cuentas.nombre;

        }


        const account =
            accounts.find(
                a =>
                    String(a.id) ===
                    String(
                        transaction.cuenta_id
                    )
            );


        return account?.nombre ||
            "Sin cuenta";

    };


    // =================================================
    // RENDER
    // =================================================

    return (

        <div
            style={{
                padding:
                    mobile
                        ? "24px 16px"
                        : "36px 40px",

                maxWidth: 1200
            }}
        >


            {/* ========================================
                HEADER
            ========================================= */}


            <div
                style={{
                    marginBottom: 32
                }}
            >

                <div
                    style={{
                        fontSize: 11,

                        color: "#9CA3AF",

                        fontWeight: 500,

                        letterSpacing:
                            "0.08em",

                        textTransform:
                            "uppercase"
                    }}
                >

                    Contabilidad

                </div>


                <h1
                    style={{
                        fontSize: 24,

                        fontWeight: 700,

                        color: "#0F1117",

                        margin: 0
                    }}
                >

                    Ingresos y Egresos

                </h1>

            </div>


            {/* ========================================
                MENSAJES
            ========================================= */}


            {error && (

                <div
                    style={{
                        marginBottom: 20,

                        padding: 14,

                        borderRadius: 8,

                        background: "#FEF2F2",

                        border:
                            "1px solid #FECACA",

                        color: "#DC2626",

                        fontSize: 13
                    }}
                >

                    {error}

                </div>

            )}


            {success && (

                <div
                    style={{
                        marginBottom: 20,

                        padding: 14,

                        borderRadius: 8,

                        background: "#F0FDF4",

                        border:
                            "1px solid #BBF7D0",

                        color: "#16A34A",

                        fontSize: 13
                    }}
                >

                    {success}

                </div>

            )}


            {/* ========================================
                KPIS
            ========================================= */}


            <div
                style={{
                    display: "grid",

                    gridTemplateColumns:
                        mobile
                            ? "1fr"
                            : "repeat(3, 1fr)",

                    gap: 20,

                    marginBottom: 32
                }}
            >


                <KpiCard
                    label="Ingresos"
                    value={formatCurrency(
                        totalIncome
                    )}
                    icon="↑"
                    color="#16A34A"
                    highlight="#F0FDF4"
                />


                <KpiCard
                    label="Egresos"
                    value={formatCurrency(
                        totalExpense
                    )}
                    icon="↓"
                    color="#DC2626"
                    highlight="#FEF2F2"
                />


                <KpiCard
                    label="Balance de movimientos"
                    value={formatCurrency(
                        netBalance
                    )}
                    icon="₡"
                    color="#0F1117"
                    highlight="#F3F4F6"
                />


            </div>


            {/* ========================================
                FORMULARIO
            ========================================= */}


            {showForm && (

                <div
                    style={{
                        ...card,

                        marginBottom: 32
                    }}
                >


                    <div
                        style={{
                            display: "flex",

                            justifyContent:
                                "space-between",

                            alignItems: "center",

                            marginBottom: 24
                        }}
                    >

                        <h2
                            style={sectionTitle}
                        >

                            {editingId
                                ? "Editar movimiento"
                                : "Nuevo movimiento"
                            }

                        </h2>


                        <button
                            type="button"
                            onClick={
                                handleCancel
                            }
                            style={{
                                ...actionButton,

                                color:
                                    "#6B7280"
                            }}
                        >

                            Cancelar

                        </button>

                    </div>


                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >


                        <div
                            style={{
                                display: "grid",

                                gridTemplateColumns:
                                    mobile
                                        ? "1fr"
                                        : "repeat(2, 1fr)",

                                gap: 20
                            }}
                        >


                            {/* TIPO */}

                            <div>

                                <label
                                    style={label}
                                >
                                    Tipo
                                </label>


                                <select
                                    name="tipo"
                                    value={
                                        form.tipo
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={
                                        input
                                    }
                                >

                                    <option value="ingreso">
                                        Ingreso
                                    </option>

                                    <option value="egreso">
                                        Egreso
                                    </option>

                                </select>

                            </div>


                            {/* CUENTA */}

                            <div>

                                <label
                                    style={label}
                                >
                                    Cuenta
                                </label>


                                <select
                                    name="cuenta_id"
                                    value={
                                        form.cuenta_id
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={
                                        input
                                    }
                                >

                                    <option value="">
                                        Seleccione una cuenta
                                    </option>


                                    {accounts
                                        .filter(
                                            a =>
                                                a.activo !== false
                                        )
                                        .map(
                                            account => (

                                                <option
                                                    key={
                                                        account.id
                                                    }
                                                    value={
                                                        account.id
                                                    }
                                                >

                                                    {
                                                        account.nombre
                                                    }

                                                </option>

                                            )
                                        )}

                                </select>

                            </div>


                            {/* DESCRIPCIÓN */}

                            <div>

                                <label
                                    style={label}
                                >
                                    Descripción
                                </label>


                                <input
                                    type="text"
                                    name="descripcion"
                                    value={
                                        form.descripcion
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Descripción del movimiento"
                                    style={
                                        input
                                    }
                                />

                            </div>


                            {/* MONTO */}

                            <div>

                                <label
                                    style={label}
                                >
                                    Monto
                                </label>


                                <input
                                    type="number"
                                    name="monto"
                                    value={
                                        form.monto
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    style={
                                        input
                                    }
                                />

                            </div>


                            {/* FECHA */}

                            <div>

                                <label
                                    style={label}
                                >
                                    Fecha
                                </label>


                                <input
                                    type="date"
                                    name="fecha"
                                    value={
                                        form.fecha
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={
                                        input
                                    }
                                />

                            </div>


                            {/* CATEGORÍA */}

                            <div>

                                <label
                                    style={label}
                                >
                                    Categoría
                                </label>


                                <input
                                    type="text"
                                    name="categoria"
                                    value={
                                        form.categoria
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Ej. Servicios"
                                    style={
                                        input
                                    }
                                />

                            </div>


                            {/* COMPROBANTE */}

                            <div
                                style={{
                                    gridColumn:
                                        mobile
                                            ? "auto"
                                            : "1 / -1"
                                }}
                            >

                                <label
                                    style={label}
                                >
                                    Comprobante
                                </label>


                                {/* =================================
                                    COMPROBANTE EXISTENTE
                                ================================== */}


                                {editingId &&
                                    !removeImage &&
                                    !imagePreview &&
                                    transactions.find(
                                        t =>
                                            t.id ===
                                            editingId
                                    )?.imagen_url && (

                                        <div
                                            style={{
                                                marginBottom: 12,

                                                padding: 12,

                                                background:
                                                    "#F9FAFB",

                                                border:
                                                    "1px solid #E5E7EB",

                                                borderRadius: 8
                                            }}
                                        >

                                            <div
                                                style={{
                                                    fontSize: 13,

                                                    color:
                                                        "#374151",

                                                    marginBottom:
                                                        10
                                                }}
                                            >

                                                Este movimiento tiene un comprobante.

                                            </div>


                                            <div
                                                style={{
                                                    display:
                                                        "flex",

                                                    gap: 10,

                                                    flexWrap:
                                                        "wrap"
                                                }}
                                            >

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleViewImage(
                                                            editingId
                                                        )
                                                    }
                                                    style={{
                                                        ...actionButton,

                                                        color:
                                                            "#2563EB"
                                                    }}
                                                >

                                                    Ver comprobante

                                                </button>


                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleRemoveImage
                                                    }
                                                    style={{
                                                        ...actionButton,

                                                        color:
                                                            "#DC2626"
                                                    }}
                                                >

                                                    Eliminar comprobante

                                                </button>

                                            </div>

                                        </div>

                                    )}


                                {/* =================================
                                    COMPROBANTE ELIMINADO
                                ================================== */}


                                {removeImage && (

                                    <div
                                        style={{
                                            padding: 12,

                                            background:
                                                "#FEF2F2",

                                            border:
                                                "1px solid #FECACA",

                                            borderRadius: 8,

                                            color:
                                                "#DC2626",

                                            fontSize: 13,

                                            marginBottom: 12
                                        }}
                                    >

                                        El comprobante será eliminado al guardar.


                                        <button
                                            type="button"
                                            onClick={
                                                handleUndoRemoveImage
                                            }
                                            style={{
                                                ...actionButton,

                                                marginLeft:
                                                    10,

                                                color:
                                                    "#2563EB"
                                            }}
                                        >

                                            Cancelar eliminación

                                        </button>

                                    </div>

                                )}


                                {/* =================================
                                    INPUT
                                ================================== */}


                                <label
                                    style={{
                                        display:
                                            "inline-block",

                                        padding:
                                            "10px 14px",

                                        border:
                                            "1px solid #D1D5DB",

                                        borderRadius: 8,

                                        cursor:
                                            "pointer",

                                        fontSize: 13,

                                        background:
                                            "#FFFFFF"
                                    }}
                                >

                                    {editingId
                                        ? "Cambiar comprobante"
                                        : "Seleccionar comprobante"
                                    }


                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={
                                            handleImageChange
                                        }
                                        style={{
                                            display:
                                                "none"
                                        }}
                                    />

                                </label>


                                {/* =================================
                                    PREVIEW
                                ================================== */}


                                {imagePreview && (

                                    <div
                                        style={{
                                            marginTop: 12
                                        }}
                                    >

                                        <img
                                            src={
                                                imagePreview
                                            }
                                            alt="Vista previa"
                                            style={{
                                                maxWidth:
                                                    250,

                                                maxHeight:
                                                    200,

                                                borderRadius:
                                                    8,

                                                border:
                                                    "1px solid #E5E7EB"
                                            }}
                                        />

                                    </div>

                                )}

                            </div>


                        </div>


                        {/* BOTÓN GUARDAR */}

                        <div
                            style={{
                                display: "flex",

                                justifyContent:
                                    "flex-end",

                                marginTop: 24
                            }}
                        >

                            <button
                                type="submit"
                                disabled={saving}
                                style={{
                                    background:
                                        saving
                                            ? "#9CA3AF"
                                            : "#0F1117",

                                    color:
                                        "#FFFFFF",

                                    border:
                                        "none",

                                    borderRadius:
                                        8,

                                    padding:
                                        "11px 20px",

                                    cursor:
                                        saving
                                            ? "not-allowed"
                                            : "pointer",

                                    fontSize: 13
                                }}
                            >

                                {saving
                                    ? "Guardando..."
                                    : editingId
                                        ? "Guardar cambios"
                                        : "Guardar movimiento"
                                }

                            </button>

                        </div>


                    </form>

                </div>

            )}


            {/* ========================================
                TABLA
            ========================================= */}


            <div style={card}>


                <div
                    style={{
                        display: "flex",

                        flexDirection:
                            mobile
                                ? "column"
                                : "row",

                        gap: 15,

                        alignItems:
                            mobile
                                ? "stretch"
                                : "center",

                        justifyContent:
                            "space-between",

                        marginBottom: 20
                    }}
                >


                    <h2
                        style={
                            sectionTitle
                        }
                    >

                        Movimientos registrados

                    </h2>

{esAdmin && (
                    <button
                        onClick={
                            handleNew
                        }
                        style={{
                            background:
                                "#0F1117",

                            color:
                                "#FFFFFF",

                            border:
                                "none",

                            borderRadius:
                                8,

                            padding:
                                "10px 16px",

                            cursor:
                                "pointer",

                            fontSize:
                                13
                        }}
                    >

                        + Nuevo movimiento

                    </button>
)}
                </div>


                {/* LOADING */}

                {loading ? (

                    <div
                        style={{
                            padding: 40,

                            textAlign:
                                "center",

                            color:
                                "#9CA3AF",

                            fontSize: 13
                        }}
                    >

                        Cargando movimientos...

                    </div>

                ) : transactions.length === 0 ? (

                    <div
                        style={{
                            padding: 40,

                            textAlign:
                                "center",

                            color:
                                "#9CA3AF",

                            fontSize: 13
                        }}
                    >

                        No hay movimientos registrados.

                    </div>

                ) : (

                    <div
                        style={{
                            overflowX:
                                "auto"
                        }}
                    >

                        <table
                            style={{
                                width:
                                    "100%",

                                minWidth:
                                    1000,

                                borderCollapse:
                                    "collapse"
                            }}
                        >


                            <thead>

                                <tr>

                                    {[
                                        "Descripción",
                                        "Tipo",
                                        "Cuenta",
                                        "Categoría",
                                        "Fecha",
                                        "Monto",
                                        "Estado",
                                        "Comprobante",
                                        "Acciones"
                                    ].map(
                                        header => (

                                            <th
                                                key={
                                                    header
                                                }
                                                style={
                                                    th
                                                }
                                            >

                                                {
                                                    header
                                                }

                                            </th>

                                        )
                                    )}

                                </tr>

                            </thead>


                            <tbody>


                                {transactions.map(
                                    transaction => {

                                        const isActive =
                                            transaction.activo !==
                                            false;


                                        return (

                                            <tr
                                                key={
                                                    transaction.id
                                                }
                                            >


                                                {/* DESCRIPCIÓN */}

                                                <td
                                                    style={
                                                        td
                                                    }
                                                >

                                                    {
                                                        transaction.descripcion
                                                    }

                                                </td>


                                                {/* TIPO */}

                                                <td
                                                    style={
                                                        td
                                                    }
                                                >

                                                    <span
                                                        style={{
                                                            padding:
                                                                "5px 10px",

                                                            borderRadius:
                                                                20,

                                                            fontSize:
                                                                12,

                                                            background:
                                                                transaction.tipo ===
                                                                "ingreso"

                                                                    ? "#DCFCE7"

                                                                    : "#FEE2E2",

                                                            color:
                                                                transaction.tipo ===
                                                                "ingreso"

                                                                    ? "#16A34A"

                                                                    : "#DC2626"
                                                        }}
                                                    >

                                                        {transaction.tipo ===
                                                        "ingreso"

                                                            ? "Ingreso"

                                                            : "Egreso"}

                                                    </span>

                                                </td>


                                                {/* CUENTA */}

                                                <td
                                                    style={
                                                        td
                                                    }
                                                >

                                                    {
                                                        getAccountName(
                                                            transaction
                                                        )
                                                    }

                                                </td>


                                                {/* CATEGORÍA */}

                                                <td
                                                    style={
                                                        td
                                                    }
                                                >

                                                    {
                                                        transaction.categoria
                                                    }

                                                </td>


                                                {/* FECHA */}

                                                <td
                                                    style={
                                                        td
                                                    }
                                                >

                                                    {
                                                        transaction.fecha
                                                            ? transaction.fecha.substring(
                                                                0,
                                                                10
                                                            )
                                                            : ""
                                                    }

                                                </td>


                                                {/* MONTO */}

                                                <td
                                                    style={{
                                                        ...td,

                                                        textAlign:
                                                            "right",

                                                        fontWeight:
                                                            600,

                                                        color:
                                                            transaction.tipo ===
                                                            "ingreso"

                                                                ? "#16A34A"

                                                                : "#DC2626"
                                                    }}
                                                >

                                                    {transaction.tipo ===
                                                    "ingreso"
                                                        ? "+"
                                                        : "-"}

                                                    {
                                                        formatCurrency(
                                                            transaction.monto
                                                        )
                                                    }

                                                </td>


                                                {/* ESTADO */}

                                                <td
                                                    style={
                                                        td
                                                    }
                                                >

                                                    <span
                                                        style={{
                                                            padding:
                                                                "5px 10px",

                                                            borderRadius:
                                                                20,

                                                            fontSize:
                                                                12,

                                                            background:
                                                                isActive
                                                                    ? "#DCFCE7"
                                                                    : "#F3F4F6",

                                                            color:
                                                                isActive
                                                                    ? "#16A34A"
                                                                    : "#6B7280"
                                                        }}
                                                    >

                                                        {isActive
                                                            ? "Activo"
                                                            : "Inactivo"}

                                                    </span>

                                                </td>


                                                {/* COMPROBANTE */}

                                                <td
                                                    style={
                                                        td
                                                    }
                                                >

                                                    {transaction.imagen_url ? (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleViewImage(
                                                                    transaction.id
                                                                )
                                                            }
                                                            style={{
                                                                ...actionButton,

                                                                color:
                                                                    "#2563EB"
                                                            }}
                                                        >

                                                            Ver

                                                        </button>

                                                    ) : (

                                                        <span
                                                            style={{
                                                                color:
                                                                    "#9CA3AF",

                                                                fontSize:
                                                                    12
                                                            }}
                                                        >

                                                            Sin comprobante

                                                        </span>

                                                    )}

                                                </td>


                                                {/* ACCIONES */}

                                                <td
                                                    style={
                                                        td
                                                    }
                                                >

                                                    <div
                                                        style={{
                                                            display:
                                                                "flex",

                                                            alignItems:
                                                                "center",

                                                            flexWrap:
                                                                "wrap",

                                                            gap:
                                                                8
                                                        }}
                                                    >

{esAdmin && (
                                                        <button
                                                            onClick={() =>
                                                                handleEdit(
                                                                    transaction
                                                                )
                                                            }
                                                            style={{
                                                                ...actionButton,

                                                                color:
                                                                    "#2563EB"
                                                            }}
                                                        >

                                                            Editar

                                                        </button>

                                                        )}

{esAdmin && (
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    transaction.id
                                                                )
                                                            }
                                                            style={{
                                                                ...actionButton,

                                                                color:
                                                                    "#DC2626"
                                                            }}
                                                        >

                                                            Eliminar

                                                        </button>

                                                        )}
                                                    </div>

                                                </td>


                                            </tr>

                                        );

                                    }
                                )}


                            </tbody>


                        </table>

                    </div>

                )}


            </div>


        </div>

    );

}


// =====================================================
// KPI CARD
// =====================================================

function KpiCard({
    label,
    value,
    icon,
    color,
    highlight
}) {

    return (

        <div
            style={{
                ...card,

                borderTop:
                    `3px solid ${color}`
            }}
        >

            <div
                style={{
                    display:
                        "flex",

                    justifyContent:
                        "space-between"
                }}
            >

                <span>
                    {label}
                </span>


                <div
                    style={{
                        width: 36,

                        height: 36,

                        borderRadius: 8,

                        background:
                            highlight ||
                            "#F3F4F6",

                        display:
                            "flex",

                        alignItems:
                            "center",

                        justifyContent:
                            "center",

                        fontSize:
                            18,

                        color
                    }}
                >

                    {icon}

                </div>

            </div>


            <div
                style={{
                    fontSize: 26,

                    fontWeight: 700,

                    marginTop: 15,

                    color
                }}
            >

                {value}

            </div>


            <small>
                Movimientos activos
            </small>

        </div>

    );

}


// =====================================================
// ESTILOS
// =====================================================

const card = {

    background:
        "#FFFFFF",

    border:
        "1px solid #E5E7EB",

    borderRadius:
        12,

    padding:
        24

};


const sectionTitle = {

    fontSize:
        14,

    fontWeight:
        600,

    color:
        "#0F1117",

    margin:
        0

};


const label = {

    display:
        "block",

    fontSize:
        12,

    fontWeight:
        500,

    color:
        "#374151",

    marginBottom:
        7

};


const input = {

    width:
        "100%",

    boxSizing:
        "border-box",

    padding:
        "10px 12px",

    border:
        "1px solid #D1D5DB",

    borderRadius:
        8,

    fontSize:
        13,

    color:
        "#374151",

    background:
        "#FFFFFF",

    outline:
        "none"

};


const th = {

    textAlign:
        "left",

    fontSize:
        11,

    color:
        "#9CA3AF",

    paddingBottom:
        12,

    paddingRight:
        12,

    borderBottom:
        "1px solid #E5E7EB",

    whiteSpace:
        "nowrap"

};


const td = {

    padding:
        "12px 8px 12px 0",

    fontSize:
        13,

    color:
        "#374151",

    borderBottom:
        "1px solid #F3F4F6",

    verticalAlign:
        "middle"

};


const actionButton = {

    background:
        "transparent",

    border:
        "none",

    cursor:
        "pointer",

    color:
        "#2563EB",

    fontSize:
        13,

    padding:
        0

};