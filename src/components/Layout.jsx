import { useState } from 'react'


const navItems = [
    {
        id: "dashboard",
        label: "Panel Principal",
        icon: GridIcon
    },
    {
        id: "transactions",
        label: "Ingresos y Egresos",
        icon: ArrowsIcon
    },
    {
        id: "accounts",
        label: "Cuentas",
        icon: WalletIcon
    },
    {
        id: "users",
        label: "Usuarios",
        icon: UsersIcon,
        adminOnly: true
    },
    {
        id: "changePassword",
        label: "Cambiar Contraseña",
        icon: UsersIcon
    },
];

const usuario =
    JSON.parse(localStorage.getItem("usuario"));

const esAdmin =
    usuario?.rol?.toLowerCase() === "admin";

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.8"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}
function ArrowsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 16V4m0 0L3 8m4-4 4 4" />
      <path d="M17 8v12m0 0 4-4m-4 4-4-4" />
    </svg>
  )
}


function WalletIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" />
      <path d="M16 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />
    </svg>
  )
}


function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    </svg>
  )
}



export default function Layout({
  currentPage,
  onNavigate,
  onLogout,
  children
}) {


  const [collapsed, setCollapsed] = useState(false)


  const usuario = JSON.parse(
    localStorage.getItem('usuario')
  )


  return (

    <div style={{
      display:'flex',
      height:'100vh',
      background:'#F9FAFB',
      overflow:'hidden'
    }}>


      <aside style={{
        width: collapsed ? 64 : 240,
        background:'#FFFFFF',
        borderRight:'1px solid #E5E7EB',
        display:'flex',
        flexDirection:'column'
      }}>


        <div style={{
          padding:'24px 20px',
          borderBottom:'1px solid #E5E7EB',
          display:'flex',
          alignItems:'center',
          justifyContent:'space-between'
        }}>


          {!collapsed && (

            <div>

              <div style={{
                fontWeight:700,
                fontSize:13
              }}>
                ASOC. DESARROLLO
              </div>


              <div style={{
                fontSize:11,
                color:'#9CA3AF'
              }}>
                Sistema Contable
              </div>

            </div>

          )}


          <button
            onClick={() =>
              setCollapsed(!collapsed)
            }
            style={{
              border:'none',
              background:'none',
              cursor:'pointer'
            }}
          >
            ☰
          </button>


        </div>



        <nav style={{
          flex:1,
          padding:12
        }}>


          {navItems
          .filter(item => !item.adminOnly || esAdmin)
          .map(item => {


            const Icon = item.icon

            const active =
              currentPage === item.id


            return (

              <button

                key={item.id}

                onClick={() =>
                  onNavigate(item.id)
                }

                style={{
                  width:'100%',
                  display:'flex',
                  alignItems:'center',
                  gap:12,
                  padding:'10px 12px',
                  marginBottom:4,
                  borderRadius:8,
                  border:'none',
                  cursor:'pointer',
                  background:
                    active
                    ? '#F3F4F6'
                    : 'transparent'
                }}

              >

                <Icon />

                {!collapsed &&
                  <span>
                    {item.label}
                  </span>
                }


              </button>

            )


          })}


        </nav>



        <div style={{
          padding:12,
          borderTop:'1px solid #E5E7EB'
        }}>


          {!collapsed && (

            <div style={{
              marginBottom:10
            }}>


              <strong>
                {usuario?.nombre || 'Usuario'}
              </strong>


              <div style={{
                fontSize:12,
                color:'#9CA3AF'
              }}>

                {usuario?.rol || ''}

              </div>


            </div>

          )}



          <button

  onClick={onLogout}

  style={{
    width:'100%',
    padding:'10px 12px',
    border:'none',
    background:'transparent',
    color:'#DC2626',
    cursor:'pointer',
    display:'flex',
    alignItems:'center',
    gap:12,
    borderRadius:8
  }}

>

  <LogoutIcon />

  {!collapsed && (
    <span>
      Cerrar sesión
    </span>
  )}

</button>


        </div>


      </aside>



      <main style={{
        flex:1,
        overflowY:'auto'
      }}>

        {children}

      </main>


    </div>

  )

}