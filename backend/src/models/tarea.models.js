const pool = require("../config/database");

// Obtener todos
const getAllTasks = async (
    id_usuario
) => {

    const result = await pool.query(
        `
        SELECT t.*
        FROM "Tareas" t
        JOIN "Usuarios" u
        ON t.id_sala = u.id_sala
        WHERE u.id_usuario = $1
        `,
        [id_usuario]
    );

    return result.rows;
};

// Obtener por ID
const getTaskById = async (id_tarea) => {
    const result = await pool.query(
        'SELECT * FROM "Tareas" WHERE id_tarea = $1',
        [id_tarea]
    );

    return result.rows[0];
};

// Crear tarea
const createTask = async ( nombre_tarea,descripcion_tarea, fecha_tarea, encargado_tarea, prioridad_tarea, estado_tarea, id_sala) => {
    const result = await pool.query(
        `INSERT INTO "Tareas" ( nombre_tarea, descripcion_tarea, fecha_tarea, estado_tarea, encargado_tarea, prioridad_tarea, id_sala)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [nombre_tarea, descripcion_tarea, fecha_tarea, estado_tarea, encargado_tarea, prioridad_tarea, id_sala]
    );

    return result.rows[0];
};

// Actualizar tarea
const updateTask = async (nombre_tarea,  descripcion_tarea, fecha_tarea, encargado_tarea, prioridad_tarea, estado_tarea, id_tarea) => {
    const result = await pool.query(
        `UPDATE "Tareas"
         SET nombre_tarea = $1,
             descripcion_tarea = $2,
             fecha_tarea = $3,
             encargado_tarea = $4,
             prioridad_tarea = $5,
             estado_tarea = $6
         WHERE id_tarea = $7
         RETURNING *`,
        [nombre_tarea, descripcion_tarea, fecha_tarea, encargado_tarea, prioridad_tarea, estado_tarea, id_tarea]
    );

    return result.rows[0];
};
//get tareas por id_usuario and sala
const getTaskByIdAndSala = async (
    id_tarea,
    id_usuario
) => {

    const result = await pool.query(
        `
        SELECT t.*
        FROM "Tareas" t
        JOIN "Usuarios" u
        ON t.id_sala = u.id_sala
        WHERE t.id_tarea = $1
        AND u.id_usuario = $2
        `,
        [id_tarea, id_usuario]
    );

    return result.rows[0];
};

// Eliminar tarea
const deleteTask = async (id_tarea) => {
    const result = await pool.query(
        `DELETE FROM "Tareas"
         WHERE id_tarea = $1
         RETURNING *`,
        [id_tarea]
    );

    return result.rows[0];
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTaskByIdAndSala
};