import { useEffect, useState } from 'react';
import axios from 'axios';
import './DashboardPage.css';

function DashboardPage() {

 
  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  useEffect(() => {

    const fetchData = async () => {

      try {

        const token = localStorage.getItem('token');

        const [tasksRes, usersRes] = await Promise.all([
          axios.get('http://localhost:3000/tasks', {
            headers: { Authorization: `Bearer ${token}` }
          }),

          axios.get('http://localhost:3000/users', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setTasks(tasksRes.data);
        setUsers(usersRes.data);

      } catch (error) {
        console.log(error);
      }

    };

    fetchData();

  }, []);

  /* =========================
      HELPERS
  ========================= */

  const getUsuario = (id: any) => {
    if (!id) return null;

    return users.find(
      (u: any) => u.id_usuario === id
    );
  };

  const getPrioridad = (id: any) => {

    switch (Number(id)) {

      case 1:
        return { label: "Baja", class: "baja" };

      case 2:
        return { label: "Media", class: "media" };

      case 3:
        return { label: "Alta", class: "alta" };

      case 4:
        return { label: "Muy alta", class: "muy-alta" };

      default:
        return { label: "Sin prioridad", class: "media" };

    }

  };
  
  /* =========================
      COLUMNAS (mock split)
  ========================= */

  const prepared = tasks.slice(0, 2);
  const doing = tasks.slice(2, 4);
  const review = tasks.slice(4, 6);
  const done = tasks.slice(6, 8);

  /* =========================
      RENDER TASK
  ========================= */

  const renderTask = (task: any, cardClass: string) => {

    const usuario = getUsuario(task.encargado_tarea);

    const nombreUsuario = usuario
      ? `${usuario.nombre_usuario} ${usuario.apellido_usuario}`
      : "Sin asignar";

    const prioridad = getPrioridad(task.prioridad_tarea);

    return (

      <div
        className={`task-card ${cardClass}`}
        key={task.id_tarea}
        onClick={() => setSelectedTask(task)}
      >

        <h3>{task.nombre_tarea}</h3>

        <p>{task.descripcion_tarea}</p>

        <div className="task-meta">

          <div className="task-user">

            <div className="mini-avatar">

              {usuario
                ? usuario.nombre_usuario[0].toUpperCase()
                : "?"
              }

            </div>

            <span>{nombreUsuario}</span>

          </div>

          <div className={`priority ${prioridad.class}`}>
            {prioridad.label}
          </div>

        </div>

      </div>

    );

  };

  return (

    <div className="dashboard">

      {/* TOPBAR */}
      <header className="topbar">

        <h1>☕ Jira Chill by Bruno</h1>

        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>

      </header>

      {/* TITLE */}
      <div className="board-title">

        <h2>PROJECT A</h2>

        <p>Organiza tus tareas tranquilamente ✨</p>

      </div>
      {/* BUTTON CODE */}
        <div className="sala-actions">
      <button
        className="copy-room-btn"
        
      >
        📋 COPIAR CÓDIGO DE SALA
      </button>
    </div>
        {/* BOARD */}
      <div className="board">

        <div className="column">
          <div className="column-label yellow">PREPARADA</div>
          {prepared.map(t => renderTask(t, 'yellow-card'))}
        </div>

        <div className="column">
          <div className="column-label blue">EN EJECUCIÓN</div>
          {doing.map(t => renderTask(t, 'blue-card'))}
        </div>

        <div className="column">
          <div className="column-label green">EN REVISIÓN</div>
          {review.map(t => renderTask(t, 'green-card'))}
        </div>

        <div className="column">
          <div className="column-label pink">TERMINADA</div>
          {done.map(t => renderTask(t, 'pink-card'))}
        </div>

      </div>

      {/* MODAL */}
      {selectedTask && (

        <div
          className="modal-overlay"
          onClick={() => setSelectedTask(null)}
        >

          <div
            className="task-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="close-btn"
              onClick={() => setSelectedTask(null)}
            >
              ✕
            </button>

            <h2>{selectedTask.nombre_tarea}</h2>

            <p className="modal-description">
              {selectedTask.descripcion_tarea}
            </p>

            <div className="modal-info">

              <div>
                <strong>Encargado:</strong>{" "}
                {getUsuario(selectedTask.encargado_tarea)
                  ? `${getUsuario(selectedTask.encargado_tarea).nombre_usuario} ${getUsuario(selectedTask.encargado_tarea).apellido_usuario}`
                  : "Sin asignar"}
              </div>

              <div>
                <strong>Prioridad:</strong>{" "}
                {getPrioridad(selectedTask.prioridad_tarea).label}
              </div>

            </div>

            <button className="assign-btn">
              Asignar miembros
            </button>

          </div>

        </div>

      )}

    </div>

  );

}

export default DashboardPage;