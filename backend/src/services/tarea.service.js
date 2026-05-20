const {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} = require("../models/tarea.models");


// GET ALL
const getTasksService = async () => {
    return await getAllTasks();
};


// GET BY ID
const getTaskByIdService = async (id) => {
    return await getTaskById(id);
};


// CREATE
const createTaskService = async (
    nombre_tarea,
    descripcion_tarea,
    fecha_tarea,
    encargado_tarea,
    prioridad_tarea,
    estado_tarea
) => {
    return await createTask(
        nombre_tarea,
        descripcion_tarea,
        fecha_tarea,
        encargado_tarea,
        prioridad_tarea,
        estado_tarea
    );
};


// UPDATE
const updateTaskService = async (
    nombre_tarea,
    descripcion_tarea,
    fecha_tarea,
    encargado_tarea,
    prioridad_tarea,
    estado_tarea,
    id
) => {
    return await updateTask(
        nombre_tarea,
        descripcion_tarea,
        fecha_tarea,
        encargado_tarea,
        prioridad_tarea,
        estado_tarea,
        id
    );
};


// DELETE
const deleteTaskService = async (id) => {
    return await deleteTask(id);
};


// EXPORT CORRECTO
module.exports = {
    getTasksService,
    getTaskByIdService,
    createTaskService,
    updateTaskService,
    deleteTaskService
};
  