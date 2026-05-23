import { useEffect, useState } from 'react';
import axios from 'axios';
import './DashboardPage.css';

function DashboardPage() {

  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [sala, setSala] = useState<any>(undefined);
  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const handleLogout = () => {

    localStorage.removeItem('token');
    window.location.reload();

  };
  const handleJoinSala = async () => {

  try {

    const token = localStorage.getItem('token');

    await axios.post(
      'http://localhost:3000/salas/join',
      {
        codigo_sala: joinCode
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    window.location.reload();

  } catch (error) {

    console.log(error);

    alert("Código inválido");

  }

};
const handleCreateSala = async () => {

  try {

    const token = localStorage.getItem('token');

    await axios.post(
      'http://localhost:3000/salas/create',
      {
        nombre_sala: roomName
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    window.location.reload();

  } catch (error) {

    console.log(error);

    alert("Error creando sala");

  }

};
  useEffect(() => {

    const fetchData = async () => {

      try {

        const token = localStorage.getItem('token');

        /* =========================
            SALA
        ========================= */

        try {

          const salaRes = await axios.get(
            'http://localhost:3000/salas/me',
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          console.log("SALA:", salaRes.data);

          setSala(salaRes.data);

        } catch {

          setSala(null);
          return;

        }

        /* =========================
            TASKS + USERS
        ========================= */

        const [tasksRes, usersRes] = await Promise.all([

          axios.get(
            'http://localhost:3000/tasks',
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          ),

          axios.get(
            'http://localhost:3000/users',
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )

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
      COLUMNAS
  ========================= */

  const prepared = tasks.filter(
    (t) => Number(t.estado_tarea) === 1
  );

  const doing = tasks.filter(
    (t) => Number(t.estado_tarea) === 2
  );

  const review = tasks.filter(
    (t) => Number(t.estado_tarea) === 3
  );

  const done = tasks.filter(
    (t) => Number(t.estado_tarea) === 4
  );

  /* =========================
      RENDER TASK
  ========================= */

  const renderTask = (
    task: any,
    cardClass: string
  ) => {

    const usuario = getUsuario(
      task.encargado_tarea
    );

    const nombreUsuario = usuario
      ? `${usuario.nombre_usuario} ${usuario.apellido_usuario}`
      : "Sin asignar";

    const prioridad = getPrioridad(
      task.prioridad_tarea
    );

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

  /* =========================
      LOADING
  ========================= */

  if (sala === undefined) {

    return <div>Cargando...</div>;

  }

  /* =========================
      NO ROOM
  ========================= */

  if (sala === null) {

    return (

      <div className="no-room-container">

        <div className="no-room-card">

          <h1>☕ Bienvenido</h1>

          <p>
            Todavía no perteneces a ninguna sala
          </p>

          <div className="no-room-actions">

            <button
              onClick={() => setShowCreatePopup(true)}
            >
              Crear sala
            </button>

            <button
              onClick={() => setShowJoinPopup(true)}
            >
              Unirse a sala
            </button>
            <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
          </div>

        </div>
          {showJoinPopup && (

          <div
            className="popup-overlay"
            onClick={() => setShowJoinPopup(false)}
          >

            <div
              className="join-popup"
              onClick={(e) => e.stopPropagation()}
            >

              <h2>Unirse a sala</h2>

              <input
                type="text"
                placeholder="Código de sala"
                value={joinCode}
                onChange={(e) =>
                  setJoinCode(
                    e.target.value.toUpperCase()
                  )
                }
              />

              <button onClick={handleJoinSala}>
                Entrar
              </button>
              
            </div>
                
          </div>
          
        )}
        {showCreatePopup && (

          <div
            className="popup-overlay"
            onClick={() => setShowCreatePopup(false)}
          >

            <div
              className="join-popup"
              onClick={(e) => e.stopPropagation()}
            >

              <h2>Crear sala</h2>

              <input
                type="text"
                placeholder="Nombre de la sala"
                value={roomName}
                onChange={(e) =>
                  setRoomName(e.target.value)
                }
              />

              <button onClick={handleCreateSala}>
                Crear
              </button>

            </div>

          </div>

        )}
      </div>

    );

  }

  /* =========================
      DASHBOARD
  ========================= */

  return (

    <div className="dashboard">

      {/* TOPBAR */}
      <header className="topbar">

        <h1>☕ Jira Chill by Bruno</h1>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>

      </header>

      {/* TITLE */}
      <div className="board-title">

        <h2>{sala?.nombre_sala}</h2>

        <p>
          Organiza tus tareas tranquilamente ✨
        </p>

      </div>

      {/* BUTTON CODE */}
      <div className="sala-actions">

        <button
          className="copy-room-btn"
          onClick={() => {

            navigator.clipboard.writeText(
              sala?.codigo_sala || ""
            );

            alert(
              "Código de sala copiado al portapapeles"
            );

          }}
        >
          📋 CODIGO DE SALA
        </button>
        
      </div>

      {/* BOARD */}
      <div className="board">

        <div className="column">

          <div className="column-label yellow">
            PREPARADA
          </div>

          {prepared.map((t) =>
            renderTask(t, 'yellow-card')
          )}

        </div>

        <div className="column">

          <div className="column-label blue">
            EN EJECUCIÓN
          </div>

          {doing.map((t) =>
            renderTask(t, 'blue-card')
          )}

        </div>

        <div className="column">

          <div className="column-label green">
            EN REVISIÓN
          </div>

          {review.map((t) =>
            renderTask(t, 'green-card')
          )}

        </div>

        <div className="column">

          <div className="column-label pink">
            TERMINADA
          </div>

          {done.map((t) =>
            renderTask(t, 'pink-card')
          )}

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

                {
                  getPrioridad(
                    selectedTask.prioridad_tarea
                  ).label
                }

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