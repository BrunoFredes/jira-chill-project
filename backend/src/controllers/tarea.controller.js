const {
    getAllTasksService,
    getTaskByIdService,
    createTaskService,
    updateTaskService,
    deleteTaskService
} = require("../services/tarea.service");

// GET ALL
const getTasks = async (req, res) => {

    console.log(req.user); // Verificar que req.user esté disponible

    try {
        const tasks = await getAllTasksService(req.user.id);
        console.log("📋 TAREAS OBTENIDAS:", tasks);
        res.json(tasks);
    } catch (error) {

        console.log("❌ ERROR GETTING TASKS:", error.message);
        res.status(500).json({
            message: error.message
        });
    }
};

// GET BY ID
const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await getTaskByIdService(id);

        if (!task) {
            return res.status(404).json({
                message: "Tarea no encontrada"
            });
        }

        res.json(task);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// CREATE
const createTask = async (req, res) => {
    try {

        console.log("🔥 CREATE TASK: REQUEST RECIBIDA");

        const {
            nombre_tarea,
            descripcion_tarea,
            fecha_tarea,
            encargado_tarea,
            prioridad_tarea,
            estado_tarea
        } = req.body;

        const newTask = await createTaskService(
            nombre_tarea,
            descripcion_tarea,
            fecha_tarea,
            encargado_tarea,
            prioridad_tarea,
            estado_tarea,
            req.user.id
        );

        console.log("✅ CREADO CORRECTAMENTE:");

        return res.status(201).json({
            ok: true,
            message: "Tarea creada correctamente",
            data: newTask
        });

    } catch (error) {

        console.log("❌ ERROR AL CREAR TAREA:", error.message);

        return res.status(500).json({
            ok: false,
            message: "Error al crear tarea",
            error: error.message
        });
    }
};
         
// UPDATE
const updateTask = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            nombre_tarea,
            descripcion_tarea,
            fecha_tarea,
            encargado_tarea,
            prioridad_tarea,
            estado_tarea,
        } = req.body;

        const updatedTask = await updateTaskService(
            
            nombre_tarea,
            descripcion_tarea,
            fecha_tarea,
            encargado_tarea,
            prioridad_tarea,
            estado_tarea,
            id,
            req.user.id
            
        );

        if (!updatedTask) {
            return res.status(404).json({
                message: "Tarea no encontrada"
            });
        }

        console.log("✏️ OK: Tarea actualizada correctamente");

        return res.json({
            ok: true,
            message: "Tarea actualizada correctamente",
            data: updatedTask
        });

    } catch (error) {

        console.log("❌ ERROR UPDATE:", error.message);

        return res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};
// DELETE
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTask = await deleteTaskService(id, req.user.id);

        if (!deletedTask) {
            return res.status(404).json({
                message: "Tarea no encontrada"
            });
        }

        res.json({
            message: "Tarea eliminada",
            task: deletedTask
        });
        console.log("🗑️ OK: Tarea eliminada");

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
        console.log("❌ ERROR DELETE:", error.message);
    }
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};