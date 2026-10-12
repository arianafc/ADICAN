import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";

import Layout from "./components/Layout";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import ForgotPassword from "./pages/forgot-password";
import Users from "./pages/Users";
import Accounts from "./pages/accounts";
import Transactions from "./pages/transactions";
import ChangePassword from "./pages/changePassword";

function AppRoutes() {

  const navigate = useNavigate();


  const handleLogin = () => {

    navigate("/dashboard");

  };


  return (

    <Routes>

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />


<Route
  path="/dashboard"
  element={
    <Layout
      currentPage="dashboard"
      onNavigate={(page) => navigate(`/${page}`)}
      onLogout={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        navigate("/");
      }}
    >
      <Dashboard />
    </Layout>
  }
/>


      <Route
        path="/"
        element={
          <Login 
            onLogin={handleLogin}
          />
        }
      />
<Route
  path="/transactions"
  element={
    <Layout
      currentPage="transactions"
      onNavigate={(page) =>
        navigate(`/${page}`)
      }
      onLogout={() => {
        localStorage.clear();
        navigate("/");
      }}
    >
      <Transactions />
    </Layout>
  }
/>

<Route
  path="/accounts"
  element={
    <Layout
      currentPage="accounts"
      onNavigate={(page) => navigate(`/${page}`)}
      onLogout={() => {
        localStorage.clear();
        navigate("/");
      }}
    >
      <Accounts />
    </Layout>
  }
/>

<Route
  path="/users"
  element={
    <Layout
      currentPage="users"
      onNavigate={(page) => navigate(`/${page}`)}
      onLogout={() => {
        localStorage.clear();
        navigate("/");
      }}
    >
      <Users />
    </Layout>
  }
/>

<Route
  path="/changePassword"
  element={
    <Layout
      currentPage="changePassword"
      onNavigate={(page) => navigate(`/${page}`)}
      onLogout={() => {
        localStorage.clear();
        navigate("/");
      }}
    >
      <ChangePassword />
    </Layout>
  }
/>

      <Route
        path="/register"
        element={<Register />}
      />


    </Routes>

  );

}



function App() {


  return (

    <BrowserRouter>

      <AppRoutes />

    </BrowserRouter>

  );


}


export default App;