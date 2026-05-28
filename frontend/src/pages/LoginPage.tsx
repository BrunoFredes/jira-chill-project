import { useState } from 'react';
import './LoginPage.css';
import Swal from 'sweetalert2';
import api from '../services/api';

function LoginPage() {

  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');

  const handleSubmit = async (
  e: React.FormEvent
) => {
    e.preventDefault();

    try {

      const body = isRegister
        ? {
            nombre_usuario: nombre,
            apellido_usuario: apellido,
            email_usuario: email,
            password_usuario: password
          }
        : {
            email_usuario: email,
            password_usuario: password
          };

      const response = await api.post(
        isRegister
          ? "/users"
          : "/auth/login",
        body
      );
      if (isRegister) {

        Swal.fire({
          icon: 'success',
          title: 'Cuenta creada',
          text: 'Cuenta creada correctamente'
        });

        setIsRegister(false);

        return;

      }
      localStorage.setItem("token", response.data.token);
      

      localStorage.setItem(
        "userId",
        response.data.user.id_usuario
      );
            

      
        window.location.reload();
      

    } catch (error) {

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Usuario o contraseña incorrectos'
      });

    }

  };

  return (

    <div className="login-container">

      <div className="background-blur"></div>

      <div className={`login-card ${isRegister ? 'register-mode' : ''}`}>
        {/* <div className="coffe-decoration">
            ☕
        </div> */}

        <div className="login-header">
          <h1>Bienvenido</h1>
          <p>Inicia sesión para continuar</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="login-form"
        >
          {isRegister && (

          <>

            <div className="input-group">

              <label>Nombre</label>

              <input
                type="text"
                placeholder="Bruno"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />

            </div>

            <div className="input-group">

              <label>Apellido</label>

              <input
                type="text"
                placeholder="Fredes"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />

            </div>

          </>

        )}
          <div className="input-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="tuemail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>

          <div className="input-group">

            <label>Contraseña</label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>

          <button type="submit">
            {isRegister ? "Registrarse" : "Iniciar sesión"}
          </button>

        </form>
        <button
          type="button"
          className="switch-mode-btn"
          onClick={() => setIsRegister(!isRegister)}
        >

          {isRegister
            ? "Ya tengo cuenta"
            : "Crear cuenta"}

        </button>
      </div>
      {/* Si ya hay un token, mostramos un mensaje o redirigimos */}
      {localStorage.getItem("token") && (
        <div className="already-logged-in"> 

        </div>
      )}

    </div>

  );

}

export default LoginPage;