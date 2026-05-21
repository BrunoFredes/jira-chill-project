const express = require('express');
const authMiddleware = require("../middlewares/auth.middleware");


const router = express.Router();

const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} = require('../controllers/tarea.controller');

// GET ALL
router.get('/', authMiddleware, getTasks);

// GET BY ID
router.get('/:id', authMiddleware, getTaskById);

// CREATE
router.post('/', authMiddleware, createTask);

// UPDATE
router.put('/:id', authMiddleware, updateTask);

// DELETE
router.delete('/:id', authMiddleware, deleteTask);

module.exports = router;