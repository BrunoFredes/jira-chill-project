const {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTaskByIdAndSala
} = require("../models/tarea.models");

const{
    getMySala,
} =require("../models/salas.models");

// GET ALL
const getAllTasksService = async (
    id_usuario
) => {

    return await getAllTasks(
        id_usuario
    );

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
    estado_tarea,
    id_usuario
) => {
    //obtener id_sala del usuario
    const sala = await getMySala(id_usuario);
    //verificar que el usuario tenga una sala
    if (!sala) {
        throw new Error("El usuario no tiene una sala asignada");
    }
    return await createTask(
        nombre_tarea,
        descripcion_tarea,
        fecha_tarea,
        encargado_tarea,
        prioridad_tarea,
        estado_tarea,
        sala.id_sala
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
    id_tarea,
    id_usuario
) => {

    // verificar que la tarea pertenezca a la sala
    const task = await getTaskByIdAndSala(
        id_tarea,
        id_usuario
    );

    if (!task) {
        throw new Error(
            "No tienes permiso para modificar esta tarea"
        );
    }

    // actualizar
    return await updateTask(
        nombre_tarea,
        descripcion_tarea,
        fecha_tarea,
        encargado_tarea,
        prioridad_tarea,
        estado_tarea,
        id_tarea,
        req.user.id
    );

};

// DELETE
const deleteTaskService = async (
    id_tarea,
    id_usuario
) => {

    // verificar ownership
    const task = await getTaskByIdAndSala(
        id_tarea,
        id_usuario
    );

    if (!task) {
        throw new Error(
            "No tienes permiso para eliminar esta tarea"
        );
    }

    return await deleteTask(
        id_tarea
    );

};

// EXPORT CORRECTO
module.exports = {
    getAllTasksService,
    getTaskByIdService,
    createTaskService,
    updateTaskService,
    deleteTaskService
};
  