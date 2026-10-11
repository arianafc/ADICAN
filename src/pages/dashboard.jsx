import { useEffect, useState } from "react";
import { getAccounts } from "../api/accountsApi";
import { getTransactions } from "../api/transactionsApi";


export default function Dashboard() {

    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [mobile, setMobile] = useState(
        window.innerWidth < 768
    );

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // CARGAR INFORMACIÓN
    // =====================================================

    useEffect(() => {

        loadDashboard();


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



    // =====================================================
    // OBTENER CUENTAS Y MOVIMIENTOS
    // =====================================================

    const loadDashboard = async () => {

    try {

        setLoading(true);
        setError("");

        // ========================================
        // OBTENER CUENTAS
        // ========================================

        const accountsData =
            await getAccounts();


        // ========================================
        // OBTENER MOVIMIENTOS
        // ========================================

        const transactionsData =
            await getTransactions();


        // ========================================
        // GUARDAR DATOS
        // ========================================

        setAccounts(
            Array.isArray(accountsData)
                ? accountsData
                : []
        );

        setTransactions(
            Array.isArray(transactionsData)
                ? transactionsData
                : []
        );


    } catch (error) {

        console.error(
            "Error cargando dashboard:",
            error
        );

        setError(
            error.message ||
            "No se pudo cargar el dashboard"
        );

    } finally {

        setLoading(false);

    }

};


    // =====================================================
    // FECHA ACTUAL
    // =====================================================

    const now = new Date();

    const currentMonth =
        now.getMonth();

    const currentYear =
        now.getFullYear();



    // =====================================================
    // SOLO MOVIMIENTOS ACTIVOS
    // =====================================================

    const activeTransactions =
        transactions.filter(
            transaction =>
                transaction.activo === true
        );



    // =====================================================
    // MOVIMIENTOS DEL MES
    // =====================================================

    const monthlyTransactions =
        activeTransactions.filter(
            transaction => {

                if (!transaction.fecha) {
                    return false;
                }


                const date =
                    new Date(
                        transaction.fecha
                    );


                return (
                    date.getMonth() ===
                    currentMonth &&

                    date.getFullYear() ===
                    currentYear
                );

            }
        );



    // =====================================================
    // INGRESOS
    // =====================================================

    const incomeTransactions =
        monthlyTransactions.filter(
            transaction =>
                transaction.tipo === "ingreso"
        );



    // =====================================================
    // EGRESOS
    // =====================================================

    const expenseTransactions =
        monthlyTransactions.filter(
            transaction =>
                transaction.tipo === "egreso"
        );



    // =====================================================
    // TOTAL INGRESOS
    // =====================================================

    const totalIncome =
        incomeTransactions.reduce(
            (total, transaction) => {

                return (
                    total +
                    Number(
                        transaction.monto || 0
                    )
                );

            },
            0
        );



    // =====================================================
    // TOTAL EGRESOS
    // =====================================================

    const totalExpense =
        expenseTransactions.reduce(
            (total, transaction) => {

                return (
                    total +
                    Number(
                        transaction.monto || 0
                    )
                );

            },
            0
        );



    // =====================================================
    // BALANCE TOTAL
    // =====================================================

    const totalBalance =
        accounts
            .filter(
                account =>
                    account.activo === true &&
                    account.moneda === "CRC"
            )
            .reduce(
                (total, account) => {

                    return (
                        total +
                        Number(
                            account.saldo || 0
                        )
                    );

                },
                0
            );



    // =====================================================
    // MOVIMIENTOS RECIENTES
    // =====================================================

    const recentTransactions =
        [...activeTransactions]
            .sort(
                (a, b) =>
                    new Date(b.fecha) -
                    new Date(a.fecha)
            )
            .slice(0, 5);



    // =====================================================
    // EGRESOS POR CATEGORÍA
    // =====================================================

    const categoryTotals =
        expenseTransactions.reduce(
            (acc, transaction) => {

                const category =
                    transaction.categoria ||
                    "Sin categoría";


                const amount =
                    Number(
                        transaction.monto || 0
                    );


                acc[category] =
                    (acc[category] || 0) +
                    amount;


                return acc;

            },
            {}
        );



    const topCategories =
        Object.entries(
            categoryTotals
        )
            .sort(
                (a, b) =>
                    b[1] - a[1]
            )
            .slice(0, 4);



    // =====================================================
    // FORMATO MONEDA
    // =====================================================

    const fmt = (
        value,
        currency = "CRC"
    ) => {

        if (currency === "USD") {

            return `$${Number(
                value
            ).toLocaleString(
                "en-US",
                {
                    minimumFractionDigits: 2
                }
            )}`;

        }


        return `₡${Number(
            value
        ).toLocaleString(
            "es-CR"
        )}`;

    };



    // =====================================================
    // FORMATO FECHA
    // =====================================================

    const formatDate = (
        date
    ) => {

        if (!date) {
            return "-";
        }


        return new Date(
            date
        ).toLocaleDateString(
            "es-CR"
        );

    };



    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div style={{
                padding: mobile
                    ? "24px 16px"
                    : "36px 40px"
            }}>

                <div style={card}>

                    <p style={{
                        margin: 0,
                        color: "#6B7280"
                    }}>
                        Cargando panel principal...
                    </p>

                </div>

            </div>

        );

    }



    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div style={{
                padding: mobile
                    ? "24px 16px"
                    : "36px 40px"
            }}>

                <div style={{
                    ...card,
                    borderTop:
                        "3px solid #DC2626"
                }}>

                    <h2 style={{
                        marginTop: 0,
                        color: "#DC2626"
                    }}>
                        Error
                    </h2>


                    <p style={{
                        color: "#374151"
                    }}>
                        {error}
                    </p>


                    <button
                        onClick={loadDashboard}
                        style={buttonPrimary}
                    >
                        Intentar nuevamente
                    </button>

                </div>

            </div>

        );

    }



    // =====================================================
    // PANEL
    // =====================================================

    return (

        <div style={{
            padding: mobile
                ? "24px 16px"
                : "36px 40px",

            maxWidth: 1200,

            width: "100%",

            boxSizing: "border-box"
        }}>


            {/* =========================================
                HEADER
            ========================================== */}

            <div style={{
                marginBottom: 32
            }}>

                <div style={{
                    fontSize: 11,
                    color: "#9CA3AF",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase"
                }}>

                    {now.toLocaleDateString(
                        "es-CR",
                        {
                            month: "long",
                            year: "numeric"
                        }
                    )}

                </div>


                <h1 style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#0F1117",
                    margin: 0
                }}>

                    Panel Principal

                </h1>

            </div>



            {/* =========================================
                KPIS
            ========================================== */}

            <div style={{
                display: "grid",

                gridTemplateColumns:
                    mobile
                        ? "1fr"
                        : "repeat(3, 1fr)",

                gap: 20,

                marginBottom: 32
            }}>


                <KpiCard
                    label="Balance total"
                    value={fmt(totalBalance)}
                    icon={<BalanceIcon />}
                    sub={`${accounts.filter(a => a.activo).length} cuentas activas`}
                    color="#0F1117"
                />


                <KpiCard
                    label="Ingresos del mes"
                    value={fmt(totalIncome)}
                    icon={<IncomeIcon />}
                    sub={`${incomeTransactions.length} movimientos`}
                    color="#16A34A"
                    highlight="#F0FDF4"
                />


                <KpiCard
                    label="Egresos del mes"
                    value={fmt(totalExpense)}
                    icon={<ExpenseIcon />}
                    sub={`${expenseTransactions.length} movimientos`}
                    color="#DC2626"
                    highlight="#FEF2F2"
                />

            </div>



            {/* =========================================
                CONTENIDO PRINCIPAL
            ========================================== */}

            <div style={{
                display: "grid",

                gridTemplateColumns:
                    mobile
                        ? "1fr"
                        : "minmax(0, 1fr) 340px",

                gap: 20
            }}>


                {/* =====================================
                    MOVIMIENTOS
                ====================================== */}

                <div style={card}>

                    <div style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        marginBottom: 20
                    }}>

                        <h2 style={sectionTitle}>
                            Movimientos recientes
                        </h2>


                        <span style={{
                            fontSize: 12,
                            color: "#9CA3AF"
                        }}>
                            Últimos 5
                        </span>

                    </div>



                    {recentTransactions.length === 0 ? (

                        <div style={{
                            padding: 30,
                            textAlign: "center",
                            color: "#9CA3AF",
                            fontSize: 13
                        }}>

                            No hay movimientos registrados.

                        </div>

                    ) : (

                        <div style={{
                            overflowX: "auto"
                        }}>

                            <table style={{
                                width: "100%",
                                minWidth: 650,
                                borderCollapse:
                                    "collapse"
                            }}>


                                <thead>

                                    <tr>

                                        <th style={th}>
                                            Descripción
                                        </th>

                                        <th style={th}>
                                            Cuenta
                                        </th>

                                        <th style={th}>
                                            Fecha
                                        </th>

                                        <th style={{
                                            ...th,
                                            textAlign:
                                                "right"
                                        }}>
                                            Monto
                                        </th>

                                    </tr>

                                </thead>



                                <tbody>

                                    {recentTransactions.map(
                                        transaction => {

                                            const isIncome =
                                                transaction.tipo ===
                                                "ingreso";


                                            return (

                                                <tr
                                                    key={
                                                        transaction.id
                                                    }
                                                >

                                                    <td style={td}>

                                                        {
                                                            transaction.descripcion
                                                        }

                                                    </td>


                                                    <td style={td}>

                                                        {
                                                            transaction
                                                                .cuentas
                                                                ?.nombre ||
                                                            "Sin cuenta"
                                                        }

                                                    </td>


                                                    <td style={td}>

                                                        {
                                                            formatDate(
                                                                transaction.fecha
                                                            )
                                                        }

                                                    </td>


                                                    <td style={{
                                                        ...td,
                                                        textAlign:
                                                            "right",
                                                        fontWeight:
                                                            600,

                                                        color:
                                                            isIncome
                                                                ? "#16A34A"
                                                                : "#DC2626"
                                                    }}>

                                                        {isIncome
                                                            ? "+"
                                                            : "-"}

                                                        {fmt(
                                                            transaction.monto,
                                                            transaction
                                                                .cuentas
                                                                ?.moneda ||
                                                            "CRC"
                                                        )}

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



                {/* =====================================
                    COLUMNA DERECHA
                ====================================== */}

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 20
                }}>


                    {/* =================================
                        CUENTAS
                    ================================== */}

                    <div style={card}>

                        <h2 style={sectionTitle}>
                            Cuentas
                        </h2>


                        {accounts.filter(
                            account =>
                                account.activo === true
                        ).length === 0 ? (

                            <div style={{
                                marginTop: 16,
                                color: "#9CA3AF",
                                fontSize: 13
                            }}>
                                No hay cuentas activas.
                            </div>

                        ) : (

                            accounts
                                .filter(
                                    account =>
                                        account.activo === true
                                )
                                .map(account => (

                                    <div
                                        key={account.id}
                                        style={{
                                            marginTop: 16,
                                            display: "flex",
                                            justifyContent:
                                                "space-between",
                                            gap: 15
                                        }}
                                    >

                                        <div>

                                            <div style={{
                                                fontWeight: 500,
                                                color:
                                                    "#374151"
                                            }}>

                                                {
                                                    account.nombre
                                                }

                                            </div>


                                            <small style={{
                                                color:
                                                    "#9CA3AF"
                                            }}>

                                                {
                                                    account.tipo
                                                }

                                            </small>

                                        </div>


                                        <strong style={{
                                            whiteSpace:
                                                "nowrap"
                                        }}>

                                            {fmt(
                                                account.saldo,
                                                account.moneda
                                            )}

                                        </strong>

                                    </div>

                                ))

                        )}

                    </div>



                    {/* =================================
                        CATEGORÍAS
                    ================================== */}

                    <div style={card}>

                        <h2 style={sectionTitle}>
                            Egresos por categoría
                        </h2>


                        {topCategories.length === 0 ? (

                            <div style={{
                                marginTop: 16,
                                color: "#9CA3AF",
                                fontSize: 13
                            }}>

                                No hay egresos
                                registrados este mes.

                            </div>

                        ) : (

                            topCategories.map(
                                ([category, total]) => {

                                    const percentage =
                                        totalExpense > 0
                                            ? Math.round(
                                                (
                                                    total /
                                                    totalExpense
                                                ) * 100
                                            )
                                            : 0;


                                    return (

                                        <div
                                            key={category}
                                            style={{
                                                marginTop: 16
                                            }}
                                        >

                                            <div style={{
                                                display: "flex",
                                                justifyContent:
                                                    "space-between",
                                                fontSize: 13
                                            }}>

                                                <span>
                                                    {category}
                                                </span>


                                                <span>
                                                    {percentage}%
                                                </span>

                                            </div>


                                            <div style={{
                                                height: 5,
                                                background:
                                                    "#F3F4F6",
                                                marginTop: 6,
                                                borderRadius: 10,
                                                overflow: "hidden"
                                            }}>

                                                <div style={{
                                                    height: "100%",
                                                    width:
                                                        `${percentage}%`,
                                                    background:
                                                        "#DC2626"
                                                }} />

                                            </div>

                                        </div>

                                    );

                                }
                            )

                        )}

                    </div>

                </div>

            </div>

        </div>

    );

}



/* =====================================================
   KPI CARD
===================================================== */

function KpiCard({
    label,
    value,
    icon,
    sub,
    color,
    highlight
}) {

    return (

        <div style={{
            ...card,
            borderTop:
                `3px solid ${color}`
        }}>


            <div style={{
                display: "flex",
                justifyContent:
                    "space-between",
                alignItems: "center"
            }}>


                <span style={{
                    fontSize: 13,
                    color: "#374151"
                }}>
                    {label}
                </span>


                <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background:
                        highlight ||
                        "#F3F4F6",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>

                    {icon}

                </div>

            </div>



            <div style={{
                fontSize: 26,
                fontWeight: 700,
                marginTop: 15,
                color
            }}>

                {value}

            </div>


            <small style={{
                color: "#9CA3AF"
            }}>

                {sub}

            </small>

        </div>

    );

}



/* =====================================================
   ICONOS
===================================================== */

function BalanceIcon() {

    return (

        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >

            <circle
                cx="12"
                cy="12"
                r="9"
            />

            <path d="M12 7v10" />

            <path d="M15 9.5c0-1.1-1.2-2-3-2s-3 .9-3 2 1.2 2 3 2 3 .9 3 2-1.2 2-3 2-3-.9-3-2" />

        </svg>

    );

}



function IncomeIcon() {

    return (

        <span style={{
            color: "#16A34A",
            fontSize: 22,
            fontWeight: 700
        }}>
            ↑
        </span>

    );

}



function ExpenseIcon() {

    return (

        <span style={{
            color: "#DC2626",
            fontSize: 22,
            fontWeight: 700
        }}>
            ↓
        </span>

    );

}



/* =====================================================
   ESTILOS
===================================================== */

const card = {

    background: "#FFFFFF",

    border: "1px solid #E5E7EB",

    borderRadius: 12,

    padding: 24,

    boxSizing: "border-box"

};



const sectionTitle = {

    fontSize: 14,

    fontWeight: 600,

    color: "#0F1117",

    margin: 0

};



const th = {

    textAlign: "left",

    fontSize: 11,

    color: "#9CA3AF",

    paddingBottom: 12,

    borderBottom:
        "1px solid #E5E7EB"

};



const td = {

    padding: "12px 0",

    fontSize: 13,

    color: "#374151",

    borderBottom:
        "1px solid #F3F4F6"

};



const buttonPrimary = {

    background: "#0F1117",

    color: "#FFFFFF",

    border: "none",

    borderRadius: 8,

    padding: "10px 16px",

    cursor: "pointer",

    fontSize: 13

};