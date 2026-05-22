
import './App.css'
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  // Verificar si el usuario está autenticado
  const token = localStorage.getItem('token');
  // Si el token existe, mostrar el Dashboard, de lo contrario mostrar el Login
  return (
    token ? <DashboardPage /> : <LoginPage />
  );
}

export default App;