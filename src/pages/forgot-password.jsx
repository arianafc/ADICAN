import { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {

  const navigate = useNavigate();

  const [cedula, setCedula] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const response = await api.post(
        "/auth/forgot-password",
        {
          cedula
        }
      );

      console.log(response.data);

      setSent(true);

    } catch (error) {

      console.error(
        "Error recuperando contraseña:",
        error
      );

      setError(
        error.response?.data?.mensaje ||
        "No se pudo enviar la contraseña al correo."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FFFFFF",
        padding: 24
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: 400
        }}
      >

        <button
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#6B7280",
            fontSize: 13,
            marginBottom: 40,
            padding: 0
          }}
        >

          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
          </svg>

          Volver al inicio de sesión

        </button>

        {sent ? (

          <div
            style={{
              textAlign: "center"
            }}
          >

            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#EFF6FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px"
              }}
            >
              ✉️
            </div>

            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#0F1117"
              }}
            >
              Revisa tu correo
            </h2>

            <p
              style={{
                fontSize: 14,
                color: "#6B7280",
                lineHeight: 1.6,
                marginBottom: 28
              }}
            >
              Se ha generado una nueva contraseña temporal
              y se ha enviado al correo asociado a tu cuenta.
            </p>

            <button
              onClick={() => navigate("/")}
              style={btnPrimary}
            >
              Entendido
            </button>

          </div>

        ) : (

          <>
            <div
              style={{
                marginBottom: 36
              }}
            >

              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#111827",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20
                }}
              >
                🔒
              </div>

              <h1
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#0F1117",
                  margin: "0 0 8px"
                }}
              >
                Recuperar contraseña
              </h1>

              <p
                style={{
                  fontSize: 14,
                  color: "#6B7280",
                  lineHeight: 1.6
                }}
              >
                Ingresa tu cédula y te enviaremos una nueva
                contraseña temporal al correo asociado a tu cuenta.
              </p>

            </div>

            <form onSubmit={handleSubmit}>

              <div
                style={{
                  marginBottom: 24
                }}
              >

                <label style={labelStyle}>
                  Cédula
                </label>

                <input
                  type="text"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  placeholder="123456789"
                  required
                  disabled={loading}
                  style={inputStyle}
                />

              </div>

              {error && (
                <div
                  style={{
                    marginBottom: 20,
                    padding: "10px 12px",
                    borderRadius: 8,
                    background: "#FEF2F2",
                    color: "#B91C1C",
                    fontSize: 13
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...btnPrimary,
                  width: "100%",
                  opacity: loading ? 0.7 : 1,
                  cursor: loading
                    ? "not-allowed"
                    : "pointer"
                }}
              >
                {loading
                  ? "Enviando..."
                  : "Enviar contraseña"
                }
              </button>

            </form>
          </>

        )}

      </div>

    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "#374151",
  marginBottom: 6
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  border: "1px solid #E5E7EB",
  borderRadius: 8,
  fontSize: 14,
  color: "#0F1117",
  background: "#fff",
  outline: "none",
  boxSizing: "border-box"
};

const btnPrimary = {
  padding: "12px 24px",
  background: "#111827",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600
};