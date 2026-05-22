import { useState } from 'react';
import axios from 'axios';
import './LoginPage.css';

function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tasks, setTasks] = useState([]);

  const handleLogin = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        "http://localhost:3000/auth/login",
        {
          email_usuario: email,
          password_usuario: password
        }
      );
      
      localStorage.setItem("token", response.data.token);
      console.log("TOKEN: " + response.data.token);


      const tasksResponse = await axios.get(
        "http://localhost:3000/tasks",
        {
          headers: {
            Authorization: `Bearer ${response.data.token}`
          }
        }
      );

      setTasks(tasksResponse.data);

      
        window.location.reload();
      

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="login-container">

      <div className="background-blur"></div>

      <div className="login-card">
        {/* <div className="coffe-decoration">
            ☕
        </div> */}

        <div className="login-header">
          <h1>Bienvenido</h1>
          <p>Inicia sesión para continuar</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="login-form"
        >

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
            Iniciar sesión
          </button>

        </form>

      </div>

      {tasks.length > 0 && (
        <div className="tasks-container">

          <h2>Tareas</h2>

          {tasks.map((task: any) => (
            <div
              className="task-card"
              key={task.id_tarea}
            >
              <h3>{task.nombre_tarea}</h3>
              <p>{task.descripcion_tarea}</p>
            </div>
          ))}

        </div>
      )}

    </div>

  );

}

export default LoginPage;