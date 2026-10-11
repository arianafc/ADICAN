import { useState } from "react";
import Swal from "sweetalert2";

const PasswordInput = ({
    label,
    value,
    setValue,
    mostrar,
    setMostrar,
    loading
}) => {

    const inputStyle = {
        width: "100%",
        padding: "12px 90px 12px 14px",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box",
        color: "#111827",
        background: "#FFFFFF"
    };

    return (
        <div style={{ marginBottom: "20px" }}>

            <label
                style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "7px"
                }}
            >
                {label}
            </label>

            <div style={{ position: "relative" }}>

                <input
                    type={mostrar ? "text" : "password"}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    style={inputStyle}
                    disabled={loading}
                />

                <button
                    type="button"
                    onClick={() => setMostrar(!mostrar)}
                    style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#6B7280",
                        fontSize: "12px",
                        padding: "4px"
                    }}
                >
                    {mostrar ? "Ocultar" : "Mostrar"}
                </button>

            </div>

        </div>
    );
};


export default function ChangePassword() {

    const [passwordActual, setPasswordActual] = useState("");
    const [nuevaPassword, setNuevaPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");

    const [mostrarActual, setMostrarActual] = useState(false);
    const [mostrarNueva, setMostrarNueva] = useState(false);
    const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

    const [loading, setLoading] = useState(false);


    const cambiarPassword = async (e) => {

        e.preventDefault();

        if (
            !passwordActual ||
            !nuevaPassword ||
            !confirmarPassword
        ) {

            Swal.fire({
                icon: "warning",
                title: "Campos incompletos",
                text: "Debe completar todos los campos.",
                confirmButtonColor: "#0F1117"
            });

            return;
        }


        if (nuevaPassword.length < 6) {

            Swal.fire({
                icon: "warning",
                title: "Contraseña inválida",
                text: "La nueva contraseña debe tener al menos 6 caracteres.",
                confirmButtonColor: "#0F1117"
            });

            return;
        }


        if (nuevaPassword !== confirmarPassword) {

            Swal.fire({
                icon: "warning",
                title: "Las contraseñas no coinciden",
                text: "Verifique que ambas contraseñas sean iguales.",
                confirmButtonColor: "#0F1117"
            });

            return;
        }


        const token = localStorage.getItem("token");

        if (!token) {

            Swal.fire({
                icon: "error",
                title: "Sesión no encontrada",
                text: "Debe iniciar sesión nuevamente.",
                confirmButtonColor: "#0F1117"
            });

            return;
        }


        try {

            setLoading(true);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/auth/changePassword`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        passwordActual,
                        nuevaPassword
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.mensaje ||
                    "No se pudo cambiar la contraseña."
                );
            }


            await Swal.fire({
                icon: "success",
                title: "Contraseña actualizada",
                text: "La contraseña se cambió correctamente.",
                confirmButtonColor: "#0F1117"
            });


            setPasswordActual("");
            setNuevaPassword("");
            setConfirmarPassword("");

            window.location.reload();


        } catch (error) {

            console.error(
                "Error cambiando contraseña:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Error",
                text:
                    error.message ||
                    "No se pudo cambiar la contraseña.",
                confirmButtonColor: "#0F1117"
            });


        } finally {

            setLoading(false);
        }
    };


    return (
        <div
            style={{
                minHeight: "100%",
                padding: "36px 40px",
                boxSizing: "border-box"
            }}
        >

            <div style={{ marginBottom: "30px" }}>

                <div
                    style={{
                        fontSize: "11px",
                        color: "#9CA3AF",
                        fontWeight: "500",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        marginBottom: "5px"
                    }}
                >
                    Seguridad
                </div>


                <h1
                    style={{
                        fontSize: "24px",
                        fontWeight: "700",
                        color: "#0F1117",
                        margin: 0
                    }}
                >
                    Cambiar contraseña
                </h1>


                <p
                    style={{
                        fontSize: "13px",
                        color: "#6B7280",
                        marginTop: "8px"
                    }}
                >
                    Actualiza la contraseña de tu cuenta.
                </p>

            </div>


            <div
                style={{
                  
                    background: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    padding: "28px",
                    boxSizing: "border-box"
                }}
            >

                <form onSubmit={cambiarPassword}>

                    <PasswordInput
                        label="Contraseña actual"
                        value={passwordActual}
                        setValue={setPasswordActual}
                        mostrar={mostrarActual}
                        setMostrar={setMostrarActual}
                        loading={loading}
                    />


                    <PasswordInput
                        label="Nueva contraseña"
                        value={nuevaPassword}
                        setValue={setNuevaPassword}
                        mostrar={mostrarNueva}
                        setMostrar={setMostrarNueva}
                        loading={loading}
                    />


                    <PasswordInput
                        label="Confirmar nueva contraseña"
                        value={confirmarPassword}
                        setValue={setConfirmarPassword}
                        mostrar={mostrarConfirmar}
                        setMostrar={setMostrarConfirmar}
                        loading={loading}
                    />


                    <div
                        style={{
                            background: "#F9FAFB",
                            border: "1px solid #E5E7EB",
                            borderRadius: "8px",
                            padding: "12px 14px",
                            marginBottom: "22px",
                            fontSize: "12px",
                            color: "#6B7280"
                        }}
                    >
                        La nueva contraseña debe tener al menos 6 caracteres.
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: "#0F1117",
                            color: "#FFFFFF",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: loading
                                ? "not-allowed"
                                : "pointer",
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading
                            ? "Cambiando contraseña..."
                            : "Cambiar contraseña"
                        }
                    </button>

                </form>

            </div>

        </div>
    );
}