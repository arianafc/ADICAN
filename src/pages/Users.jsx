import { useEffect, useState } from "react";
import {
    getUsers,
    createUser,
    deleteUser,
    toggleUserStatus,
    updateUser
} from "../api/usersApi";

const mockUsers = [

];

const usuario =
    JSON.parse(
        localStorage.getItem("usuario")
    );

const esAdmin =
    usuario?.rol?.toLowerCase() === "admin";

export default function Users() {

    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const clearModal = () => {

        setShowModal(false);

        setEditingUser(null);

        setForm({

            nombre: "",
            cedula: "",
            correo: "",
            password: "",
            rol: "lector"

        });

    };
    const handleEdit = (user) => {

        const clearModal = () => {

            setShowModal(false);

            setEditingUser(null);

            setForm({

                nombre: "",
                cedula: "",
                correo: "",
                password: "",
                rol: "lector"

            });

        };


        setEditingUser({

            id: user.id,
            nombre: user.nombre,
            cedula: user.cedula,
            correo: user.correo,
            rol: user.rol,
            activo: user.activo

        });


        setShowModal(true);

    };
    const [form, setForm] = useState({

        nombre: "",
        cedula: "",
        correo: "",
        password: "",
        rol: "lector"

    });

    const handleToggleStatus = async (user) => {

        try {


            const result = await toggleUserStatus(
                user.id,
                user.activo
            );


            alert(
                result.message
            );


            getUsers();
            window.location.reload();


        } catch (error) {


            alert(
                error.message || "Error cambiando estado"
            );


        }

    };

    const handleDelete = async (id) => {

        const confirmar = window.confirm(
            "¿Está seguro de eliminar este usuario?"
        );

        if (!confirmar) {
            return;
        }

        try {

            const result = await deleteUser(id);

            alert(result.message);

            getUsers();

        } catch (error) {

            alert(
                error.message || "Error eliminando usuario"
            );

        }

    };
    const saveUser = async () => {


        try {


            let result;


            if (editingUser) {


                result = await updateUser(
                    editingUser.id,
                    editingUser
                );


            } else {


                result = await createUser(form);


            }



            alert(result.message);



            clearModal();


            getUsers();
            window.location.reload();


        } catch (error) {


            alert(
                error.message
            );


        }


    };

    const [mobile, setMobile] = useState(
        window.innerWidth < 768
    );

    const [users, setUsers] = useState([]);


   useEffect(() => {

    const loadUsers = async () => {

        try {

            const data = await getUsers();

            setUsers(
                Array.isArray(data)
                    ? data
                    : data.usuarios || []
            );

        } catch (error) {

            console.error(
                "Error cargando usuarios:",
                error
            );

            setUsers([]);

        }

    };

    loadUsers();


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

    const totalUsers = users.length;


    const admins = users.filter(
        u => u.rol === "Admin"
    ).length;


    const readers = users.filter(
        u => u.rol === "Lector"
    ).length;







    return (

        <div style={{
            padding: mobile ? "24px 16px" : "36px 40px",
            maxWidth: 1200
        }}>



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
                    Administración
                </div>



                <h1 style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#0F1117",
                    margin: 0
                }}>
                    Usuarios
                </h1>


            </div>






            {/* KPIS */}

            <div style={{
                display: "grid",
                gridTemplateColumns:
                    mobile
                        ? "1fr"
                        : "repeat(3,1fr)",
                gap: 20,
                marginBottom: 32
            }}>



                <KpiCard
                    label="Total usuarios"
                    value={totalUsers}
                    icon="👥"
                />


                <KpiCard
                    label="Administradores"
                    value={admins}
                    icon="🛡️"
                />


                <KpiCard
                    label="Lectores"
                    value={readers}
                    icon="👁️"
                />


            </div>








            {/* TABLA */}


            <div style={card}>


                <div style={{
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
                    justifyContent: "space-between",
                    marginBottom: 20
                }}>


                    <h2 style={sectionTitle}>
                        Usuarios registrados
                    </h2>




                </div>





                <div style={{
                    overflowX: "auto"
                }}>


                    <table style={{
                        width: "100%",
                        minWidth: 750,
                        borderCollapse: "collapse"
                    }}>


                        <thead>


                            <tr>

                                {
                                    [
                                        "Nombre",
                                        "Cédula",
                                        "Correo",
                                        "Rol",
                                        "Estado",
                                        "Acciones"
                                    ].map(header => (

                                        <th
                                            key={header}
                                            style={th}
                                        >

                                            {header}

                                        </th>

                                    ))
                                }


                            </tr>


                        </thead>





                        <tbody>


                            {
                                users.map(user => (


                                    <tr key={user.id}>


                                        <td style={td}>
                                            {user.nombre}
                                        </td>



                                        <td style={td}>
                                            {user.cedula}
                                        </td>



                                        <td style={td}>
                                            {user.correo}
                                        </td>




                                        <td style={td}>


                                            <span style={{

                                                padding: "5px 10px",

                                                borderRadius: 20,

                                                fontSize: 12,

                                                background:
                                                    user.rol === "Admin"
                                                        ? "#F3E8FF"
                                                        : "#EFF6FF",

                                                color:
                                                    user.rol === "Lector"
                                                        ? "#9333EA"
                                                        : "#2563EB"

                                            }}>

                                                {user.rol}

                                            </span>


                                        </td>





                                        <td style={td}>

                                            <span style={{

                                                padding: "5px 10px",
                                                borderRadius: 20,
                                                fontSize: 12,

                                                background:
                                                    user.activo
                                                        ? "#DCFCE7"
                                                        : "#FEE2E2",

                                                color:
                                                    user.activo
                                                        ? "#16A34A"
                                                        : "#DC2626"

                                            }}>

                                                {user.activo ? "Activo" : "Inactivo"}

                                            </span>

                                        </td>





                                        <td style={td}>

{esAdmin && (

                                            <button

                                                onClick={() => handleEdit(user)}

                                                style={actionButton}

                                            >
                                                Editar
                                            </button>

)}
                                           {esAdmin && ( <button
                                                onClick={() => handleToggleStatus(user)}
                                                style={{
                                                    ...actionButton,
                                                    color: user.activo
                                                        ? "#DC2626"
                                                        : "#16A34A"
                                                }}
                                            >

                                                {
                                                    user.activo
                                                        ? "Desactivar"
                                                        : "Activar"
                                                }

                                            </button>
                                           )}
                                        </td>




                                    </tr>


                                ))
                            }



                        </tbody>



                    </table>


                </div>



            </div>

            {
                showModal && (

                    <div style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,0,0,.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>


                        <div style={{
                            background: "#FFFFFF",
                            padding: 30,
                            borderRadius: 12,
                            width: 400
                        }}>

                            <h2>
                                {editingUser ? "Editar usuario" : "Nuevo usuario"}
                            </h2>


                            {/* Nombre, cédula y correo */}

                            {[
                                ["nombre", "Nombre completo"],
                                ["cedula", "Cédula"],
                                ["correo", "Correo"]
                            ].map(([field, label]) => (

                                <input

                                    key={field}

                                    placeholder={label}

                                    type="text"

                                    value={
                                        editingUser
                                            ? editingUser[field] || ""
                                            : form[field]
                                    }

                                    onChange={(e) => {

                                        const value = e.target.value;

                                        if (editingUser) {

                                            setEditingUser({
                                                ...editingUser,
                                                [field]: value
                                            });

                                        } else {

                                            setForm({
                                                ...form,
                                                [field]: value
                                            });

                                        }

                                    }}

                                    style={{
                                        width: "100%",
                                        padding: 10,
                                        marginBottom: 12,
                                        border: "1px solid #E5E7EB",
                                        borderRadius: 8
                                    }}

                                />

                            ))}


                            {/* CONTRASEÑA: solamente al crear */}

                            {!editingUser && (

                                <input

                                    placeholder="Contraseña"

                                    type="password"

                                    value={form.password}

                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            password: e.target.value
                                        })
                                    }

                                    style={{
                                        width: "100%",
                                        padding: 10,
                                        marginBottom: 12,
                                        border: "1px solid #E5E7EB",
                                        borderRadius: 8
                                    }}

                                />

                            )}


                            {/* ROL */}

                            <select

                                value={
                                    editingUser
                                        ? editingUser.rol
                                        : form.rol
                                }

                                onChange={(e) => {

                                    if (editingUser) {

                                        setEditingUser({
                                            ...editingUser,
                                            rol: e.target.value
                                        });

                                    } else {

                                        setForm({
                                            ...form,
                                            rol: e.target.value
                                        });

                                    }

                                }}

                                style={{
                                    width: "100%",
                                    padding: 10,
                                    marginBottom: 15,
                                    border: "1px solid #E5E7EB",
                                    borderRadius: 8
                                }}

                            >

                                <option value="Lector">
                                    Lector
                                </option>

                                <option value="Admin">
                                    Administrador
                                </option>

                            </select>


                            {/* BOTONES */}

                            <div style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 10
                            }}>

                                <button style={{
                                        background: "#b8b4b4",
                                        color: "#000000",
                                        padding: "8px 16px",
                                        borderRadius: 8,
                                        border: "none",
                                        cursor: "pointer"
                                    }}
                                    onClick={clearModal}
                                >
                                    Cancelar
                                </button>


                                <button
                                    onClick={saveUser}
                                    style={{
                                        background: "#0F1117",
                                        color: "#FFFFFF",
                                        padding: "8px 16px",
                                        borderRadius: 8,
                                        border: "none",
                                        cursor: "pointer"
                                    }}
                                >
                                    {editingUser ? "Guardar cambios" : "Crear usuario"}
                                </button>

                            </div>

                        </div>


                    </div>

                )
            }

        </div>


    );

}



function KpiCard({
    label,
    value,
    icon
}) {


    return (

        <div style={{
            ...card,
            borderTop: "3px solid #0F1117"
        }}>



            <div style={{
                display: "flex",
                justifyContent: "space-between"
            }}>


                <span>
                    {label}
                </span>



                <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: "#F3F4F6",
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
                color: "#0F1117"
            }}>

                {value}

            </div>




            <small>
                Usuarios registrados
            </small>



        </div>

    );

}

const card = {

    background: "#FFFFFF",

    border: "1px solid #E5E7EB",

    borderRadius: 12,

    padding: 24

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

    borderBottom: "1px solid #E5E7EB"

};





const td = {

    padding: "12px 0",

    fontSize: 13,

    color: "#374151",

    borderBottom: "1px solid #F3F4F6"

};





const actionButton = {

    background: "transparent",

    border: "none",

    cursor: "pointer",

    color: "#2563EB",

    fontSize: 13,

    marginRight: 12

};