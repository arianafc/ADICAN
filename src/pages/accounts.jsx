import { useEffect, useState } from "react";

import {
  getAccounts,
  createAccount,
  updateAccount,
  toggleAccountStatus,
  deleteAccount
} from "../api/accountsApi";


const usuario =
    JSON.parse(localStorage.getItem("usuario"));

const esAdmin =
    usuario?.rol?.toLowerCase() === "admin";

export default function Accounts(){


  const [mobile,setMobile] = useState(
    window.innerWidth < 768
  );


  const [accounts,setAccounts] = useState([]);


  const [showModal,setShowModal] = useState(false);


  const [editingAccount,setEditingAccount] =
    useState(null);


  const [form,setForm] = useState({

    nombre:"",
    tipo:"Banco",
    moneda:"CRC",
    saldo:0

  });



  // ========================================
  // CARGAR CUENTAS
  // ========================================

  useEffect(()=>{

    loadAccounts();


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

  },[]);



  const loadAccounts = async()=>{

    try{

      const data = await getAccounts();

      setAccounts(data);

    }catch(error){

      console.error(
        "Error cargando cuentas:",
        error
      );

    }

  };



  // ========================================
  // LIMPIAR MODAL
  // ========================================

  const clearModal = () => {

    setShowModal(false);

    setEditingAccount(null);

    setForm({

      nombre:"",
      tipo:"Banco",
      moneda:"CRC",
      saldo:0

    });

  };



  // ========================================
  // NUEVA CUENTA
  // ========================================

  const handleNew = () => {

    setEditingAccount(null);

    setForm({

      nombre:"",
      tipo:"Banco",
      moneda:"CRC",
      saldo:0

    });

    setShowModal(true);

  };



  // ========================================
  // EDITAR
  // ========================================

  const handleEdit = (account) => {

    setEditingAccount({

      id:account.id,
      nombre:account.nombre,
      tipo:account.tipo,
      moneda:account.moneda,
      saldo:account.saldo,
      activo:account.activo

    });

    setShowModal(true);

  };



  // ========================================
  // GUARDAR
  // ========================================

  const saveAccount = async()=>{

    try{

      let result;


      if(editingAccount){

        result = await updateAccount(
          editingAccount.id,
          {
            nombre:editingAccount.nombre,
            tipo:editingAccount.tipo,
            moneda:editingAccount.moneda,
            saldo:Number(editingAccount.saldo),
            activo:editingAccount.activo
          }
        );


      }else{

        result = await createAccount({

          nombre:form.nombre,
          tipo:form.tipo,
          moneda:form.moneda,
          saldo:Number(form.saldo)

        });

      }


      alert(result.message);


      clearModal();


      loadAccounts();


    }catch(error){

      alert(
        error?.message ||
        "Error guardando cuenta"
      );

    }

  };



  // ========================================
  // ACTIVAR / DESACTIVAR
  // ========================================

  const handleToggleStatus = async(account)=>{

    try{

      const result =
        await toggleAccountStatus(
          account.id,
          account.activo
        );


      alert(result.message);


      loadAccounts();


    }catch(error){

      alert(
        error?.message ||
        "Error cambiando estado"
      );

    }

  };



  // ========================================
  // ELIMINAR
  // ========================================

  const handleDelete = async(id)=>{

    const confirmDelete =
      window.confirm(
        "¿Está seguro de eliminar esta cuenta?"
      );


    if(!confirmDelete){
      return;
    }


    try{

      const result =
        await deleteAccount(id);


      alert(result.message);


      loadAccounts();


    }catch(error){

      alert(
        error?.message ||
        "Error eliminando cuenta"
      );

    }

  };



  // ========================================
  // KPIs
  // ========================================

  const totalAccounts =
    accounts.length;


  const activeAccounts =
    accounts.filter(
      account => account.activo
    ).length;


  const totalBalance =
    accounts
      .filter(
        account =>
          account.moneda === "CRC"
          &&
          account.activo
      )
      .reduce(
        (total,account) =>
          total + Number(account.saldo || 0),
        0
      );



  const formatCurrency = (
    amount,
    currency
  ) => {

    if(currency === "USD"){

      return `$${Number(amount)
        .toLocaleString("en-US",{
          minimumFractionDigits:2
        })}`;

    }


    return `₡${Number(amount)
      .toLocaleString("es-CR")}`;

  };



  return (

    <div style={{
      padding:
        mobile
          ? "24px 16px"
          : "36px 40px",

      maxWidth:1200
    }}>


      {/* HEADER */}

      <div style={{
        marginBottom:32
      }}>

        <div style={{
          fontSize:11,
          color:"#9CA3AF",
          fontWeight:500,
          letterSpacing:"0.08em",
          textTransform:"uppercase"
        }}>
          Administración
        </div>


        <h1 style={{
          fontSize:24,
          fontWeight:700,
          color:"#0F1117",
          margin:0
        }}>
          Cuentas
        </h1>

      </div>



      {/* KPIS */}

      <div style={{
        display:"grid",

        gridTemplateColumns:
          mobile
            ? "1fr"
            : "repeat(3,1fr)",

        gap:20,

        marginBottom:32
      }}>


        <KpiCard
          label="Balance total"
          value={formatCurrency(
            totalBalance,
            "CRC"
          )}
          icon="₡"
        />


        <KpiCard
          label="Total cuentas"
          value={totalAccounts}
          icon="▣"
        />


        <KpiCard
          label="Cuentas activas"
          value={activeAccounts}
          icon="✓"
        />


      </div>



      {/* TABLA */}

      <div style={card}>


        <div style={{
          display:"flex",

          flexDirection:
            mobile
              ? "column"
              : "row",

          gap:15,

          alignItems:
            mobile
              ? "stretch"
              : "center",

          justifyContent:"space-between",

          marginBottom:20
        }}>


          <h2 style={sectionTitle}>
            Cuentas registradas
          </h2>

{esAdmin && ( 
          <button

            onClick={handleNew}

            style={{
              background:"#0F1117",
              color:"#FFFFFF",
              border:"none",
              borderRadius:8,
              padding:"10px 16px",
              cursor:"pointer",
              fontSize:13
            }}

          >
            + Nueva cuenta

          </button>
)}

        </div>



        <div style={{
          overflowX:"auto"
        }}>


          <table style={{
            width:"100%",
            minWidth:750,
            borderCollapse:"collapse"
          }}>


            <thead>

              <tr>

                {
                  [
                    "Nombre",
                    "Tipo",
                    "Moneda",
                    "Saldo",
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
                accounts.map(account => (

                  <tr key={account.id}>


                    <td style={td}>
                      {account.nombre}
                    </td>


                    <td style={td}>
                      {account.tipo}
                    </td>


                    <td style={td}>
                      {account.moneda}
                    </td>


                    <td style={{
                      ...td,
                      fontWeight:600
                    }}>

                      {formatCurrency(
                        account.saldo,
                        account.moneda
                      )}

                    </td>


                    <td style={td}>

                      <span style={{
                        padding:"5px 10px",
                        borderRadius:20,
                        fontSize:12,

                        background:
                          account.activo
                            ? "#DCFCE7"
                            : "#F3F4F6",

                        color:
                          account.activo
                            ? "#16A34A"
                            : "#6B7280"
                      }}>

                        {
                          account.activo
                            ? "Activa"
                            : "Inactiva"
                        }

                      </span>

                    </td>


                    <td style={td}>

{esAdmin && (
                      <button

                        onClick={() =>
                          handleEdit(account)
                        }

                        style={actionButton}

                      >
                        Editar
                      </button>

                      )}                
{esAdmin && (
                      <button

                        onClick={() =>
                          handleToggleStatus(account)
                        }

                        style={{
                          ...actionButton,

                          color:
                            account.activo
                              ? "#DC2626"
                              : "#16A34A"
                        }}

                      >

                        {
                          account.activo
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



      {/* MODAL */}

      {
        showModal && (

          <div style={modalOverlay}>


            <div style={{
              ...modal,
              width:
                mobile
                  ? "calc(100% - 32px)"
                  : 420
            }}>


              <h2 style={{
                marginTop:0
              }}>

                {
                  editingAccount
                    ? "Editar cuenta"
                    : "Nueva cuenta"
                }

              </h2>



              {/* NOMBRE */}

              <input

                placeholder="Nombre de la cuenta"

                value={
                  editingAccount
                    ? editingAccount.nombre
                    : form.nombre
                }

                onChange={(e)=>{

                  if(editingAccount){

                    setEditingAccount({
                      ...editingAccount,
                      nombre:e.target.value
                    });

                  }else{

                    setForm({
                      ...form,
                      nombre:e.target.value
                    });

                  }

                }}

                style={input}

              />



              {/* TIPO */}

              <select

                value={
                  editingAccount
                    ? editingAccount.tipo
                    : form.tipo
                }

                onChange={(e)=>{

                  if(editingAccount){

                    setEditingAccount({
                      ...editingAccount,
                      tipo:e.target.value
                    });

                  }else{

                    setForm({
                      ...form,
                      tipo:e.target.value
                    });

                  }

                }}

                style={input}

              >

                <option value="Banco">
                  Banco
                </option>

                <option value="Efectivo">
                  Efectivo
                </option>

              </select>



              {/* MONEDA */}

              <select

                value={
                  editingAccount
                    ? editingAccount.moneda
                    : form.moneda
                }

                onChange={(e)=>{

                  if(editingAccount){

                    setEditingAccount({
                      ...editingAccount,
                      moneda:e.target.value
                    });

                  }else{

                    setForm({
                      ...form,
                      moneda:e.target.value
                    });

                  }

                }}

                style={input}

              >

                <option value="CRC">
                  Colones (CRC)
                </option>

                <option value="USD">
                  Dólares (USD)
                </option>

              </select>



              {/* SALDO */}

              <input

                type="number"

                placeholder="Saldo"

                value={
                  editingAccount
                    ? editingAccount.saldo
                    : form.saldo
                }

                onChange={(e)=>{

                  const value =
                    e.target.value;

                  if(editingAccount){

                    setEditingAccount({
                      ...editingAccount,
                      saldo:value
                    });

                  }else{

                    setForm({
                      ...form,
                      saldo:value
                    });

                  }

                }}

                style={input}

              />



              {/* BOTONES */}

              <div style={{
                display:"flex",
                justifyContent:"flex-end",
                gap:10,
                marginTop:10
              }}>


                <button
                  onClick={clearModal}
                  style={cancelButton}
                >
                  Cancelar
                </button>


                <button
                  onClick={saveAccount}
                  style={saveButton}
                >

                  {
                    editingAccount
                      ? "Guardar cambios"
                      : "Crear cuenta"
                  }

                </button>


              </div>


            </div>


          </div>

        )
      }


    </div>

  );

}



// ========================================
// KPI
// ========================================

function KpiCard({
  label,
  value,
  icon
}){

  return (

    <div style={{
      ...card,
      borderTop:"3px solid #0F1117"
    }}>


      <div style={{
        display:"flex",
        justifyContent:"space-between"
      }}>


        <span>
          {label}
        </span>


        <div style={{
          width:36,
          height:36,
          borderRadius:8,
          background:"#F3F4F6",
          display:"flex",
          alignItems:"center",
          justifyContent:"center"
        }}>

          {icon}

        </div>


      </div>


      <div style={{
        fontSize:26,
        fontWeight:700,
        marginTop:15,
        color:"#0F1117"
      }}>

        {value}

      </div>


      <small>
        Información actual
      </small>


    </div>

  );

}



// ========================================
// ESTILOS
// ========================================

const card = {

  background:"#FFFFFF",

  border:"1px solid #E5E7EB",

  borderRadius:12,

  padding:24

};



const sectionTitle = {

  fontSize:14,

  fontWeight:600,

  color:"#0F1117",

  margin:0

};



const th = {

  textAlign:"left",

  fontSize:11,

  color:"#9CA3AF",

  paddingBottom:12,

  borderBottom:"1px solid #E5E7EB"

};



const td = {

  padding:"12px 0",

  fontSize:13,

  color:"#374151",

  borderBottom:"1px solid #F3F4F6"

};



const actionButton = {

  background:"transparent",

  border:"none",

  cursor:"pointer",

  color:"#2563EB",

  fontSize:13,

  marginRight:12,

  padding:0

};



const input = {

  width:"100%",

  padding:10,

  marginBottom:12,

  border:"1px solid #E5E7EB",

  borderRadius:8,

  boxSizing:"border-box"

};



const modalOverlay = {

  position:"fixed",

  top:0,

  left:0,

  width:"100%",

  height:"100%",

  background:"rgba(0,0,0,.3)",

  display:"flex",

  alignItems:"center",

  justifyContent:"center",

  zIndex:1000

};



const modal = {

  background:"#FFFFFF",

  padding:30,

  borderRadius:12,

  boxSizing:"border-box",

  maxHeight:"90vh",

  overflowY:"auto"

};



const cancelButton = {

  padding:"9px 16px",

  border:"1px solid #E5E7EB",

  background:"#FFFFFF",

  borderRadius:8,

  cursor:"pointer"

};



const saveButton = {

  padding:"9px 16px",

  border:"none",

  background:"#0F1117",

  color:"#FFFFFF",

  borderRadius:8,

  cursor:"pointer"

};