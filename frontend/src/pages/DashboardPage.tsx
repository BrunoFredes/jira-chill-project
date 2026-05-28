import { useEffect, useState } from 'react';
import './DashboardPage.css';
import Swal from 'sweetalert2';
import { 
  DragDropContext,
  Droppable,
  Draggable,
 } from '@hello-pangea/dnd';import api from '../services/api';
function DashboardPage() {  const [isLeader, setIsLeader] = useState(false);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [sala, setSala] = useState<any>(undefined);
  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showTaskPopup, setShowTaskPopup] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState(1)
  const [taskAssignedUser, setTaskAssignedUser] = useState<number | null>(null);
  const handleLogout = () => {localStorage.removeItem('token');
window.location.reload();  };
  const handleJoinSala = async () => {  try {const token = localStorage.getItem('token');

await api.post(
  '/salas/join',
  {
    codigo_sala: joinCode
  },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
Swal.fire({
  icon: 'success',
  title: 'Te uniste a la sala',
  timer: 1500,
  showConfirmButton: false
});
window.location.reload();  } catch (error) {console.log(error);

Swal.fire({
  icon: 'error',
  title: 'Código inválido',
  text: 'La sala no existe o el código es incorrecto'
});  }};
const handleCreateSala = async () => {  try {const token = localStorage.getItem('token');

await api.post(
  '/salas/create',
  {
    nombre_sala: roomName
  },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
Swal.fire({
  icon: 'success',
  title: 'Sala creada',
  timer: 1500,
  showConfirmButton: false
});
window.location.reload();  } catch (error) {console.log(error);

Swal.fire({
  icon: 'error',
  title: 'Error',
  text: 'No se pudo crear la sala'
});  }};
const handleCreateTask = async () => {  try {const token = localStorage.getItem('token');

await api.post(
  '/tasks',
  {
    nombre_tarea: taskName,
    descripcion_tarea: taskDescription,
    prioridad_tarea: taskPriority,
    encargado_tarea: taskAssignedUser || null,
    estado_tarea: 1
  },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
Swal.fire({
  icon: 'success',
  title: 'Tarea creada',
  timer: 1500,
  showConfirmButton: false
});
window.location.reload();  } catch (error) {console.log(error);

Swal.fire({
  icon: 'error',
  title: 'Error',
  text: 'No se pudo crear la tarea'
});  }};
const handleDragEnd = async (result: any) => {  if (!result.destination) return;  const taskId = Number(result.draggableId);  const newEstado = Number(
    result.destination.droppableId
  );  // SOLO EL LIDER PUEDE TERMINAR
  if (newEstado === 4 && !isLeader) {
    Swal.fire({
      icon: 'warning',
      title: 'Acción bloqueada',
      text: 'Solo el líder puede mover tareas a TERMINADA'
    });
    return;
  }  const oldTasks = tasks;  const updatedTasks = tasks.map((task) => {
    if (task.id_tarea === taskId) {
      return {
        ...task,
        estado_tarea: newEstado
      };
    }
    return task;
  });  setTasks(updatedTasks);  try {const token = localStorage.getItem('token');

await api.put(
  `/tasks/${taskId}/estado`,
  { estado_tarea: newEstado },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

const tasksRes = await api.get(
  '/tasks',
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
setTasks(tasksRes.data);
  Swal.fire({
  icon: 'success',
  title: 'Tarea actualizada',
  timer: 1000,
  showConfirmButton: false
});
} catch (error) {
    console.log(error);
    setTasks(oldTasks);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo mover la tarea'
    });
  }
};
const handleDeleteTask = async (
  taskId: number
) => {

  try {

    const token = localStorage.getItem('token');

    await api.delete(
      `/tasks/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setTasks(
      tasks.filter(
        (t) => t.id_tarea !== taskId
      )
    );

    setSelectedTask(null);
    Swal.fire({
      icon: 'success',
      title: 'Tarea eliminada',
      timer: 1500,
      showConfirmButton: false
    });

  } catch (error) {

    console.log(error);

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo eliminar la tarea'
    });

  }

};
const handleAssignTask = async (
  taskId: number,
  userId: number | null
) => {

  try {

    const token = localStorage.getItem('token');

    await api.put(
      `/tasks/${taskId}/assign`,
      {
        encargado_tarea: userId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // ACTUALIZA TASKS
    setTasks((prevTasks) =>
      prevTasks.map((task) => {

        if (task.id_tarea === taskId) {

          return {
            ...task,
            encargado_tarea: userId
          };

        }

        return task;

      })
    );
    const newTasks = tasks.map((task) => {

      if (task.id_tarea === taskId) {

        return {
          ...task,
          encargado_tarea: userId
        };

      }

      return task;

    });

    setTasks(newTasks);
    // ACTUALIZA EL POPUP ABIERTO
    setSelectedTask((prev: any) => {

      if (!prev) return prev;

      const updatedTask = tasks.find(
        (t) => t.id_tarea === taskId
      );

      return {
        updatedTask
      };

    });
    Swal.fire({
  icon: 'success',
  title: 'Tarea asignada',
  timer: 1200,
  showConfirmButton: false
});
  } catch (error) {

    console.log(error);

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo asignar la tarea'
    });

  }

};
  useEffect(() => {const fetchData = async () => {

  try {

    const token = localStorage.getItem('token');
    if (!token) {

      window.location.href = '/login';
      return;

    }
    /* =========================
        SALA
    ========================= */

    try {

      const salaRes = await api.get(
        '/salas/me',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("SALA:", salaRes.data);

      setSala(salaRes.data);
      const currentUserId = Number(
        localStorage.getItem("userId")
      );

      const salaCreatorId = Number(
        salaRes.data.creador_sala
      );

      setIsLeader(
        currentUserId === salaCreatorId
      );
    } catch (error: any) {

        if (error.response?.status === 401) {

          localStorage.removeItem('token');
          localStorage.removeItem('userId');

          window.location.href = '/login';

          return;

        }

        setSala(null);
    }


    /* =========================
        TASKS + USERS
    ========================= */

    const [tasksRes, usersRes] = await Promise.all([

      api.get(
        '/tasks',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      ),

      api.get(
        '/salas/me/users',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

    ]);

    setTasks(tasksRes.data);
    console.log("USUARIOS:", usersRes.data);
    setUsers(usersRes.data);

  } catch (error) {

    console.log(error);

  }

};


fetchData();  }, []);  /* =========================
      HELPERS
  ========================= */  const getUsuario = (id: any) => {if (!id) return null;

return users.find(
  (u: any) => u.id_usuario === id
);  };  const getPrioridad = (id: any) => {switch (Number(id)) {

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

}  };  /* =========================
      COLUMNAS
  ========================= */  const prepared = tasks.filter(
    (t) => Number(t.estado_tarea) === 1
  );  const doing = tasks.filter(
    (t) => Number(t.estado_tarea) === 2
  );  const review = tasks.filter(
    (t) => Number(t.estado_tarea) === 3
  );  const done = tasks.filter(
    (t) => Number(t.estado_tarea) === 4
  );  /* =========================
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
      onClick={() => setSelectedTask(task)}
    >

      <h3>{task.nombre_tarea}</h3>

      <p>{task.descripcion_tarea}</p>

      <div className="task-meta">

        <div className="task-user">

          <div className="mini-avatar">

            {usuario
              ? usuario.nombre_usuario[0].toUpperCase()
              : "?"}

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
  ========================= */  if (sala === undefined) {return <div>Cargando...</div>;  }  /* =========================
      NO ROOM
  ========================= */  if (sala === null) {return (

  <div className="no-room-container">

    <div className="no-room-card">

      <h1> Bienvenido</h1>

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

);  }  /* =========================
      DASHBOARD
  ========================= */  return (<div className="dashboard">

  {/* TOPBAR */}
  <header className="topbar">

    
    <h1 className='tittle'> Jira Chill by Bruno</h1>

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
      Organiza tus tareas tranquilamente 
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

        Swal.fire({
          icon: 'success',
          title: 'Copiado',
          text: 'Código de sala copiado al portapapeles',
          timer: 1500,
          showConfirmButton: false
        });

      }}
    >
       CODIGO DE SALA
    </button>
    {isLeader && (
      <button
        className="copy-room-btn"
        onClick={() => setShowTaskPopup(true)}
      >
         Crear tarea
      </button>
    )}
  </div>

  {/* BOARD */}

    <DragDropContext onDragEnd={handleDragEnd}>

      <div className="board">

        {/* PREPARADA */}
        <Droppable droppableId="1">

          {(provided) => (

            <div
              className="column"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >

              <div className="column-label yellow">
                PREPARADA
              </div>

              {prepared.map((t, index) => (

                
                <Draggable
                  key={t.id_tarea}
                  draggableId={t.id_tarea.toString()}
                  index={index}
                >

                  {(provided, snapshot) => (

                    <div
                      
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={provided.draggableProps.style}
                    >

                      {renderTask(
                        t,
                        'yellow-card'
                      )}

                    </div>

                  )}

                </Draggable>

              ))}

              {provided.placeholder}

            </div>

          )}

        </Droppable>

        {/* EN EJECUCIÓN */}
        <Droppable droppableId="2">

          {(provided) => (

            <div
              className="column"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >

              <div className="column-label blue">
                EN EJECUCIÓN
              </div>

              {doing.map((t, index) => (

                <Draggable
                  key={t.id_tarea}
                  draggableId={t.id_tarea.toString()}
                  index={index}
                >

                  {(provided, snapshot) => (

                    <div
                      
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={provided.draggableProps.style}
                    >

                      {renderTask(
                        t,
                        'blue-card'
                      )}

                    </div>

                  )}

                </Draggable>

              ))}

              {provided.placeholder}

            </div>

          )}

        </Droppable>

        {/* EN REVISIÓN */}
        <Droppable droppableId="3">

          {(provided) => (

            <div
              className="column"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >

              <div className="column-label green">
                EN REVISIÓN
              </div>

              {review.map((t, index) => (

                <Draggable
                  key={t.id_tarea}
                  draggableId={t.id_tarea.toString()}
                  index={index}
                >

                  {(provided, snapshot) => (

                    <div
                      
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={provided.draggableProps.style}
                    >

                      {renderTask(
                        t,
                        'green-card'
                      )}

                    </div>

                  )}

                </Draggable>

              ))}

              {provided.placeholder}

            </div>

          )}

        </Droppable>

        {/* TERMINADA */}
        <Droppable droppableId="4">

          {(provided) => (

            <div
              className="column"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >

              <div className="column-label pink">
                TERMINADA
              </div>

              {done.map((t, index) => (

                <Draggable
                  key={t.id_tarea}
                  draggableId={t.id_tarea.toString()}
                  index={index}
                >

                  {(provided, snapshot) => (

                      <div
                       
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={provided.draggableProps.style}
                      >

                      {renderTask(
                        t,
                        'pink-card'
                      )}

                    </div>

                  )}

                </Draggable>

              ))}

              {provided.placeholder}

            </div>

          )}

        </Droppable>

      </div>

    </DragDropContext>
    {showTaskPopup && (

  <div
    className="popup-overlay"
    onClick={() => setShowTaskPopup(false)}
  >

    <div
      className="join-popup"
      onClick={(e) => e.stopPropagation()}
    >

      <h2>Crear tarea</h2>

      <input
        type="text"
        placeholder="Nombre de la tarea"
        value={taskName}
        onChange={(e) =>
          setTaskName(e.target.value)
        }
      />

      <textarea
        placeholder="Descripción"
        value={taskDescription}
        onChange={(e) =>
          setTaskDescription(e.target.value)
        }
      />
      <select
        value={taskAssignedUser ?? ''}
        onChange={(e) =>
          setTaskAssignedUser(
            e.target.value
              ? Number(e.target.value)
              : null
          )
        }
      >

        <option value="">
          Sin asignar
        </option>

        {users.map((user) => (

          <option
            key={user.id_usuario}
            value={user.id_usuario}
          >

            {user.nombre_usuario}{" "}
            {user.apellido_usuario}

          </option>

        ))}

      </select>
      <select
        value={taskPriority}
        onChange={(e) =>
          setTaskPriority(Number(e.target.value))
        }
      >

        <option value={1}>
          Baja
        </option>

        <option value={2}>
          Media
        </option>

        <option value={3}>
          Alta
        </option>

        <option value={4}>
          Muy alta
        </option>

      </select>

      <button
        onClick={async () => {

          await handleCreateTask();

          setShowTaskPopup(false);

          setTaskName('');
          setTaskDescription('');
          setTaskPriority(1);

        }}
      >
        Crear
      </button>

    </div>

  </div>

)}
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

      <h2>
        {selectedTask.nombre_tarea}
      </h2>

      <p className="modal-description">
        {selectedTask.descripcion_tarea}
      </p>

      <div className="modal-info">

        <span>
          <strong>Prioridad:</strong>{" "}
          {
            getPrioridad(
              selectedTask.prioridad_tarea
            ).label
          }
        </span>
          
        <span>
          <strong>Estado:</strong>{" "}

          {Number(selectedTask.estado_tarea) === 1 && "Preparada"}
          {Number(selectedTask.estado_tarea) === 2 && "En ejecución"}
          {Number(selectedTask.estado_tarea) === 3 && "En revisión"}
          {Number(selectedTask.estado_tarea) === 4 && "Terminada"}

        </span>

              <div>

        <strong>Asignado a:</strong>

        <select
          className="assign-select"
          value={selectedTask.encargado_tarea || ''}
          onChange={(e) => {

            handleAssignTask(
              selectedTask.id_tarea,
              e.target.value
                ? Number(e.target.value)
                : null
            );

          }}
        >

          <option value="">
            Sin asignar
          </option>

          {users.map((user) => (

            <option
              key={user.id_usuario}
              value={user.id_usuario}
            >

              {user.nombre_usuario}{" "}
              {user.apellido_usuario}

            </option>

          ))}

        </select>

      </div>
        {isLeader && (

  <button
    className="delete-task-btn"
    onClick={() => {

      const confirmDelete = window.confirm(
        "¿Eliminar esta tarea?"
      );

      if (confirmDelete) {

        handleDeleteTask(
          selectedTask.id_tarea
        );

      }

    }}
  >
    🗑 Eliminar tarea
  </button>

)}
      </div>
          
    </div>

  </div>

)}

  
</div>  );}
export default DashboardPage;

