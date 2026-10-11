import { useState } from 'react'
import api from '../api/axiosConfig'
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {

  const navigate = useNavigate();
  const [cedula, setCedula] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
    

  const handleSubmit = async (e) => {

    e.preventDefault()
    setLoading(true)

    try {

      const response = await api.post('/auth/login', {
        cedula,
        password
      })


      localStorage.setItem(
        'token',
        response.data.token
      )


      localStorage.setItem(
        'usuario',
        JSON.stringify(response.data.usuario)
      )
      

      onLogin()
      window.location.reload();

    } catch (error) {

        console.log(error)
      alert(
        error.response?.data?.mensaje ||
        'Credenciales incorrectas'
      )


    } finally {

      setLoading(false)

    }

  }


  return (
    

    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#FFFFFF'
    }}>


      {/* Panel izquierdo */}

      <div style={{
        flex: '0 0 420px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 48px'
      }}>


        <div style={{ marginBottom: 48 }}>


          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: '#111827',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20
          }}>

            🏠

          </div>


          <div style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: '#9CA3AF',
            textTransform: 'uppercase',
            marginBottom: 4
          }}>

            Asociación de Desarrollo Integral - La Cangreja

          </div>


          <h1 style={{
            fontSize: 26,
            fontWeight: 700,
            color: '#0F1117',
            margin: 0
          }}>

            Iniciar sesión

          </h1>


          <p style={{
            fontSize: 14,
            color: '#6B7280',
            marginTop: 8
          }}>

            Ingresa tus credenciales para continuar

          </p>


        </div>



        <form onSubmit={handleSubmit}>


          <div style={{ marginBottom: 20 }}>

            <label style={labelStyle}>
              Cédula
            </label>


            <input

              type="text"

              value={cedula}

              onChange={(e)=>
                setCedula(e.target.value)
              }

              placeholder="1-1111-1111"

              required

              style={inputStyle}

            />

          </div>




          <div style={{ marginBottom: 12 }}>


            <label style={labelStyle}>
              Contraseña
            </label>


            <div style={{
              position:'relative'
            }}>


              <input

                type={
                  showPass
                  ? 'text'
                  : 'password'
                }

                value={password}

                onChange={(e)=>
                  setPassword(e.target.value)
                }

                placeholder="••••••••"

                required

                style={{
                  ...inputStyle,
                  paddingRight:44
                }}

              />


              <button

                type="button"

                onClick={() =>
                  setShowPass(!showPass)
                }

                style={eyeButton}

              >

                {showPass ? '🙈' : '👁'}

              </button>


            </div>


          </div>




          <div style={{
            textAlign:'right',
            marginBottom:28
          }}>


            <button

              type="button"

              onClick={() =>
                navigate('forgot-password')
              }

              style={linkButton}

            >

              ¿Olvidaste tu contraseña?

            </button>


          </div>





          <button

            type="submit"

            disabled={loading}

            style={{
              width:'100%',
              padding:'12px 0',
              background:'#111827',
              color:'#fff',
              border:'none',
              borderRadius:8,
              cursor:'pointer',
              fontSize:14,
              fontWeight:600,
              opacity:loading ? .7 : 1
            }}

          >

            {
              loading
              ? 'Ingresando...'
              : 'Ingresar'
            }


          </button>


        </form>
<button className="mt-4"

              type="button"

              onClick={() =>
                navigate('register')
              }

              style={linkButton}

            >
            
             ¿No tienes cuenta?, crear cuenta

            </button>



        <p style={{
          textAlign:'center',
          fontSize:12,
          color:'#9CA3AF',
          marginTop:32
        }}>

          Sistema Contable para ADI La Cangreja

        </p>



      </div>





      {/* Panel derecho */}

      <div style={{
        flex:1,
        background:'#F9FAFB',
        borderLeft:'1px solid #E5E7EB',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        padding:48
      }}>



        <div style={{
          maxWidth:360
        }}>



          <div style={cardStyle}>


            <h3 style={{
              marginTop:0,
              fontSize:18
            }}>

              Gestión financiera

            </h3>


            <p style={descriptionStyle}>
              Administre ingresos, egresos y reportes
              financieros de manera sencilla.
            </p>


          </div>



          <div style={cardStyle}>


            <h3 style={{
              marginTop:0,
              fontSize:18
            }}>

              Control y seguridad

            </h3>


            <p style={descriptionStyle}>
              Acceso según roles y permisos
              asignados a cada usuario.
            </p>


          </div>


        </div>


      </div>



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
  outline:'none',
  boxSizing:'border-box'

}



const eyeButton = {

  position:'absolute',
  right:12,
  top:'50%',
  transform:'translateY(-50%)',
  background:'none',
  border:'none',
  cursor:'pointer'

}



const linkButton = {

  background:'none',
  border:'none',
  cursor:'pointer',
  color:'#2563EB',
  fontSize:13

}



const cardStyle = {

  background:'#FFFFFF',
  borderRadius:16,
  border:'1px solid #E5E7EB',
  padding:24,
  marginBottom:16,
  boxShadow:'0 1px 4px rgba(0,0,0,0.04)'

}



const descriptionStyle = {

  fontSize:14,
  color:'#6B7280',
  lineHeight:1.6

}