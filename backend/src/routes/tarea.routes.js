const express = require('express');
const router = express.Router();

const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} = require('../controllers/tarea.controller');

// GET ALL
router.get('/', getTasks);

// GET BY ID
router.get('/:id', getTaskById);

// CREATE
router.post('/', createTask);

// UPDATE
router.put('/:id', updateTask);

// DELETE
router.delete('/:id', deleteTask);

module.exports = router;