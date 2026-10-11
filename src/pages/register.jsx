import { useState } from 'react'
import api from '../api/axiosConfig'
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    cedula: '',
    correo: '',
    password: '',
    confirm: ''
  })


  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)



  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

  }




  const handleSubmit = async (e) => {

    e.preventDefault()


    if(form.password !== form.confirm){

      alert('Las contraseñas no coinciden')
      return

    }


    try {


      setLoading(true)


      await api.post('/auth/register', {

        nombre: form.nombre,
        cedula: form.cedula,
        correo: form.correo,
        password: form.password

      })


      setDone(true)



    } catch(error){

      alert(
        error.response?.data?.mensaje ||
        'Error al crear usuario'
      )


    } finally {

      setLoading(false)

    }


  }




  if(done){

    return (

      <div style={{
        minHeight:'100vh',
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
      }}>


        <div style={{
          textAlign:'center',
          maxWidth:360
        }}>


          <div style={{
            width:56,
            height:56,
            borderRadius:'50%',
            background:'#F0FDF4',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            margin:'0 auto 20px'
          }}>

            ✓

          </div>



          <h2 style={{
            fontSize:22
          }}>

            Cuenta creada

          </h2>



          <p style={{
            color:'#6B7280'
          }}>

            Tu usuario fue registrado correctamente.

          </p>



          <button
            onClick={() => navigate('/')}
            style={btnPrimary}
          >

            Volver al inicio

          </button>


        </div>


      </div>

    )

  }





  return (

    <div style={{
      minHeight:'100vh',
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      padding:24,
      background:'#FFFFFF'
    }}>


      <div style={{
        width:'100%',
        maxWidth:480
      }}>



        <button

          onClick={() => navigate('/')}

          style={backButton}

        >

          ← Volver

        </button>




        <div style={{
          marginBottom:36
        }}>


          <div style={{
            width:40,
            height:40,
            borderRadius:10,
            background:'#111827',
            color:'#fff',
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            marginBottom:20
          }}>

            🏠

          </div>



          <h1 style={{
            fontSize:26,
            margin:0
          }}>

            Crear cuenta

          </h1>



          <p style={{
            color:'#6B7280'
          }}>

            Registra tus datos para acceder al sistema contable

          </p>



        </div>





        <form onSubmit={handleSubmit}>


          <Input
            label="Nombre completo"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Juan Pérez Mora"
          />



          <Input
            label="Cédula"
            name="cedula"
            value={form.cedula}
            onChange={handleChange}
            placeholder="1-1111-1111"
          />



          <Input
            label="Correo electrónico"
            name="correo"
            type="email"
            value={form.correo}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
          />




          <div style={{
            display:'grid',
            gridTemplateColumns:'1fr 1fr',
            gap:16
          }}>


            <Input
              label="Contraseña"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />



            <Input
              label="Confirmar"
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={handleChange}
              placeholder="••••••••"
            />


          </div>





          <button

            disabled={loading}

            style={{
              ...btnPrimary,
              width:'100%',
              marginTop:24,
              opacity:loading ? .7 : 1
            }}

          >

            {
              loading
              ? 'Creando cuenta...'
              : 'Crear cuenta'
            }


          </button>


        </form>




        <p style={{
          textAlign:'center',
          marginTop:24,
          fontSize:13,
          color:'#6B7280'
        }}>


          ¿Ya tienes cuenta?{' '}


          <button

            onClick={() => navigate('/')}

            style={linkButton}

          >

            Inicia sesión

          </button>


        </p>



      </div>


    </div>

  )

}





function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type='text'
}){


  return (

    <div style={{
      marginBottom:16
    }}>


      <label style={labelStyle}>

        {label}

      </label>



      <input

        type={type}

        name={name}

        value={value}

        onChange={onChange}

        placeholder={placeholder}

        required

        style={inputStyle}

      />


    </div>

  )

}





const labelStyle = {

  display:'block',
  fontSize:13,
  fontWeight:500,
  color:'#374151',
  marginBottom:6

}



const inputStyle = {

  width:'100%',
  padding:'10px 14px',
  border:'1px solid #E5E7EB',
  borderRadius:8,
  fontSize:14,
  boxSizing:'border-box',
  outline:'none'

}



const btnPrimary = {

  padding:'12px 24px',
  background:'#111827',
  color:'#fff',
  border:'none',
  borderRadius:8,
  cursor:'pointer',
  fontWeight:600

}



const linkButton = {

  background:'none',
  border:'none',
  color:'#2563EB',
  cursor:'pointer'

}



const backButton = {

  background:'none',
  border:'none',
  cursor:'pointer',
  color:'#6B7280',
  marginBottom:32

}